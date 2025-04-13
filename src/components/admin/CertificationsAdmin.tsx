
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { getCertifications, addDocument, updateDocument, deleteDocument, uploadFile } from '@/services/firebase';
import { CertificationData } from '@/types/admin';
import { Plus, Pencil, Trash } from 'lucide-react';

const CertificationsAdmin = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [certificationsList, setCertificationsList] = useState<CertificationData[]>([]);
  const [currentCertification, setCurrentCertification] = useState<CertificationData>({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    skills: [],
    logoUrl: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCertificationsData();
  }, []);

  const fetchCertificationsData = async () => {
    try {
      setIsLoading(true);
      const data = await getCertifications();
      setCertificationsList(data as CertificationData[]);
    } catch (error) {
      console.error("Error fetching certifications data:", error);
      toast({
        title: "Error",
        description: "Could not fetch certifications data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentCertification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() !== '') {
      setCurrentCertification(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setCurrentCertification(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
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
    setCurrentCertification({
      title: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      skills: [],
      logoUrl: ''
    });
    setSkillInput('');
    setLogoFile(null);
    setLogoPreview(null);
    setIsEditing(false);
  };

  const handleEdit = (item: CertificationData) => {
    setCurrentCertification(item);
    setLogoPreview(item.logoUrl || null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      await deleteDocument('certifications', id);
      setCertificationsList(prevList => prevList.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Certification deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting certification:", error);
      toast({
        title: "Error",
        description: "Could not delete certification. Please try again.",
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
      let updatedLogoUrl = currentCertification.logoUrl || '';
      
      // Upload logo if a new one was selected
      if (logoFile) {
        const timestamp = Date.now();
        const filePath = `certification_logos/${timestamp}_${logoFile.name}`;
        updatedLogoUrl = await uploadFile(logoFile, filePath);
      }

      // Prepare data for update
      const dataToUpdate = {
        ...currentCertification,
        logoUrl: updatedLogoUrl,
      };

      if (isEditing && currentCertification.id) {
        // Update existing record
        await updateDocument('certifications', currentCertification.id, dataToUpdate);
        setCertificationsList(prevList => 
          prevList.map(item => 
            item.id === currentCertification.id ? { ...dataToUpdate, id: item.id } : item
          )
        );
        toast({
          title: "Success",
          description: "Certification updated successfully.",
        });
      } else {
        // Add new record
        const newDoc = await addDocument('certifications', dataToUpdate);
        if (newDoc && newDoc.id) {
          setCertificationsList(prevList => [...prevList, { ...dataToUpdate, id: newDoc.id }]);
        }
        toast({
          title: "Success",
          description: "Certification added successfully.",
        });
      }
      
      // Reset the form
      resetForm();
    } catch (error) {
      console.error("Error saving certification data:", error);
      toast({
        title: "Error",
        description: "Could not save certification information. Please try again.",
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
          <CardTitle>{isEditing ? 'Edit Certification' : 'Add Certification'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Certification Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={currentCertification.title}
                  onChange={handleInputChange}
                  required
                  placeholder="AWS Certified Solutions Architect"
                />
              </div>
              
              <div>
                <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 mb-1">
                  Issuing Organization
                </label>
                <Input
                  id="issuer"
                  name="issuer"
                  value={currentCertification.issuer}
                  onChange={handleInputChange}
                  required
                  placeholder="Amazon Web Services"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date
                </label>
                <Input
                  id="issueDate"
                  name="issueDate"
                  value={currentCertification.issueDate}
                  onChange={handleInputChange}
                  required
                  placeholder="May 2022"
                />
              </div>
              
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date (Optional)
                </label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  value={currentCertification.expiryDate}
                  onChange={handleInputChange}
                  placeholder="May 2025"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="credentialId" className="block text-sm font-medium text-gray-700 mb-1">
                  Credential ID (Optional)
                </label>
                <Input
                  id="credentialId"
                  name="credentialId"
                  value={currentCertification.credentialId}
                  onChange={handleInputChange}
                  placeholder="AWS-ASA-12345"
                />
              </div>
              
              <div>
                <label htmlFor="credentialUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Credential URL (Optional)
                </label>
                <Input
                  id="credentialUrl"
                  name="credentialUrl"
                  value={currentCertification.credentialUrl}
                  onChange={handleInputChange}
                  placeholder="https://www.yourverify.com/credential/123"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <div className="flex items-center gap-2 mb-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill"
                />
                <Button 
                  type="button" 
                  onClick={handleAddSkill}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {currentCertification.skills.map((skill, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded-md px-3 py-1">
                    <span className="mr-2">{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                Certification Logo
              </label>
              <Input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
              />
              <div className="mt-2">
                {(logoPreview || currentCertification.logoUrl) && (
                  <div className="relative w-16 h-16 overflow-hidden">
                    <img 
                      src={logoPreview || currentCertification.logoUrl} 
                      alt="Certification Logo" 
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
                {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Add Certification'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certifications List</CardTitle>
        </CardHeader>
        <CardContent>
          {certificationsList.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No certifications found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Issuer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificationsList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.issuer}</TableCell>
                    <TableCell>{item.issueDate}</TableCell>
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

export default CertificationsAdmin;
