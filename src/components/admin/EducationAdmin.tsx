
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { getEducation, addDocument, updateDocument, deleteDocument, uploadFile } from '@/services/firebase';
import { EducationData } from '@/types/admin';
import { Plus, Pencil, Trash } from 'lucide-react';

const EducationAdmin = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [educationList, setEducationList] = useState<EducationData[]>([]);
  const [currentEducation, setCurrentEducation] = useState<EducationData>({
    degree: '',
    institution: '',
    startDate: '',
    endDate: '',
    description: '',
    logoUrl: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEducationData();
  }, []);

  const fetchEducationData = async () => {
    try {
      setIsLoading(true);
      const data = await getEducation();
      setEducationList(data as EducationData[]);
    } catch (error) {
      console.error("Error fetching education data:", error);
      toast({
        title: "Error",
        description: "Could not fetch education data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentEducation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setLogoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setCurrentEducation({
      degree: '',
      institution: '',
      startDate: '',
      endDate: '',
      description: '',
      logoUrl: ''
    });
    setLogoFile(null);
    setLogoPreview(null);
    setIsEditing(false);
  };

  const handleEdit = (item: EducationData) => {
    setCurrentEducation(item);
    setLogoPreview(item.logoUrl || null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      await deleteDocument('education', id);
      setEducationList(prevList => prevList.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Education entry deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting education:", error);
      toast({
        title: "Error",
        description: "Could not delete education entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let updatedLogoUrl = currentEducation.logoUrl || '';
      
      // Upload logo if a new one was selected
      if (logoFile) {
        const timestamp = Date.now();
        const filePath = `education_logos/${timestamp}_${logoFile.name}`;
        updatedLogoUrl = await uploadFile(logoFile, filePath);
      }

      // Prepare data for update
      const dataToUpdate = {
        ...currentEducation,
        logoUrl: updatedLogoUrl,
      };

      if (isEditing && currentEducation.id) {
        // Update existing record
        await updateDocument('education', currentEducation.id, dataToUpdate);
        setEducationList(prevList => 
          prevList.map(item => 
            item.id === currentEducation.id ? { ...dataToUpdate, id: item.id } : item
          )
        );
        toast({
          title: "Success",
          description: "Education information updated successfully.",
        });
      } else {
        // Add new record
        const newDoc = await addDocument('education', dataToUpdate);
        if (newDoc && newDoc.id) {
          setEducationList(prevList => [...prevList, { ...dataToUpdate, id: newDoc.id }]);
        }
        toast({
          title: "Success",
          description: "Education information added successfully.",
        });
      }
      
      // Reset the form
      resetForm();
    } catch (error) {
      console.error("Error saving education data:", error);
      toast({
        title: "Error",
        description: "Could not save education information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Education' : 'Add Education'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
                  Degree
                </label>
                <Input
                  id="degree"
                  name="degree"
                  value={currentEducation.degree}
                  onChange={handleInputChange}
                  required
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>
              
              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
                  Institution
                </label>
                <Input
                  id="institution"
                  name="institution"
                  value={currentEducation.institution}
                  onChange={handleInputChange}
                  required
                  placeholder="University of Technology"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <Input
                  id="startDate"
                  name="startDate"
                  value={currentEducation.startDate}
                  onChange={handleInputChange}
                  required
                  placeholder="September 2016"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <Input
                  id="endDate"
                  name="endDate"
                  value={currentEducation.endDate}
                  onChange={handleInputChange}
                  placeholder="June 2020 (or 'Present')"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={currentEducation.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Brief description of your studies, achievements, etc."
              />
            </div>

            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                Institution Logo
              </label>
              <Input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
              />
              <div className="mt-2">
                {(logoPreview || currentEducation.logoUrl) && (
                  <div className="relative w-16 h-16 overflow-hidden">
                    <img 
                      src={logoPreview || currentEducation.logoUrl} 
                      alt="Institution Logo" 
                      className="object-contain w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              {isEditing && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-portfolio-blue hover:bg-portfolio-dark-blue"
              >
                {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Add Education'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education List</CardTitle>
        </CardHeader>
        <CardContent>
          {educationList.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No education entries found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Degree</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {educationList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.degree}</TableCell>
                    <TableCell>{item.institution}</TableCell>
                    <TableCell>{`${item.startDate} - ${item.endDate}`}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(item.id)} 
                          className="text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationAdmin;
