
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { getExperience, addDocument, updateDocument, deleteDocument, uploadFile } from '@/services/firebase';
import { ExperienceData } from '@/types/admin';
import { Plus, Pencil, Trash } from 'lucide-react';

const ExperienceAdmin = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [experienceList, setExperienceList] = useState<ExperienceData[]>([]);
  const [currentExperience, setCurrentExperience] = useState<ExperienceData>({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    logoUrl: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchExperienceData();
  }, []);

  const fetchExperienceData = async () => {
    try {
      setIsLoading(true);
      const data = await getExperience();
      setExperienceList(data as ExperienceData[]);
    } catch (error) {
      console.error("Error fetching experience data:", error);
      toast({
        title: "Error",
        description: "Could not fetch experience data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentExperience(prev => ({
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
    setCurrentExperience({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      logoUrl: ''
    });
    setLogoFile(null);
    setLogoPreview(null);
    setIsEditing(false);
  };

  const handleEdit = (item: ExperienceData) => {
    setCurrentExperience(item);
    setLogoPreview(item.logoUrl || null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      await deleteDocument('experience', id);
      setExperienceList(prevList => prevList.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Experience entry deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast({
        title: "Error",
        description: "Could not delete experience entry. Please try again.",
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
      let updatedLogoUrl = currentExperience.logoUrl || '';
      
      // Upload logo if a new one was selected
      if (logoFile) {
        const timestamp = Date.now();
        const filePath = `company_logos/${timestamp}_${logoFile.name}`;
        updatedLogoUrl = await uploadFile(logoFile, filePath);
      }

      // Prepare data for update
      const dataToUpdate = {
        ...currentExperience,
        logoUrl: updatedLogoUrl,
      };

      if (isEditing && currentExperience.id) {
        // Update existing record
        await updateDocument('experience', currentExperience.id, dataToUpdate);
        setExperienceList(prevList => 
          prevList.map(item => 
            item.id === currentExperience.id ? { ...dataToUpdate, id: item.id } : item
          )
        );
        toast({
          title: "Success",
          description: "Experience information updated successfully.",
        });
      } else {
        // Add new record
        const newDoc = await addDocument('experience', dataToUpdate);
        if (newDoc && newDoc.id) {
          setExperienceList(prevList => [...prevList, { ...dataToUpdate, id: newDoc.id }]);
        }
        toast({
          title: "Success",
          description: "Experience information added successfully.",
        });
      }
      
      // Reset the form
      resetForm();
    } catch (error) {
      console.error("Error saving experience data:", error);
      toast({
        title: "Error",
        description: "Could not save experience information. Please try again.",
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
          <CardTitle>{isEditing ? 'Edit Experience' : 'Add Experience'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={currentExperience.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Senior Software Engineer"
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <Input
                  id="company"
                  name="company"
                  value={currentExperience.company}
                  onChange={handleInputChange}
                  required
                  placeholder="Tech Solutions Inc."
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <Input
                id="location"
                name="location"
                value={currentExperience.location}
                onChange={handleInputChange}
                placeholder="San Francisco, CA"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <Input
                  id="startDate"
                  name="startDate"
                  value={currentExperience.startDate}
                  onChange={handleInputChange}
                  required
                  placeholder="January 2018"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <Input
                  id="endDate"
                  name="endDate"
                  value={currentExperience.endDate}
                  onChange={handleInputChange}
                  placeholder="Present"
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
                value={currentExperience.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your responsibilities, achievements, and technologies used..."
              />
            </div>

            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                Company Logo
              </label>
              <Input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
              />
              <div className="mt-2">
                {(logoPreview || currentExperience.logoUrl) && (
                  <div className="relative w-16 h-16 overflow-hidden">
                    <img 
                      src={logoPreview || currentExperience.logoUrl} 
                      alt="Company Logo" 
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
                {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Add Experience'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Experience List</CardTitle>
        </CardHeader>
        <CardContent>
          {experienceList.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No experience entries found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experienceList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.company}</TableCell>
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

export default ExperienceAdmin;
