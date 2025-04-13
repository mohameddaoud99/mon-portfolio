
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from "@/components/ui/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { getProjects, addDocument, updateDocument, deleteDocument, uploadFile } from '@/services/firebase';
import { ProjectData } from '@/types/admin';
import { Plus, Pencil, Trash } from 'lucide-react';

const ProjectsAdmin = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [projectsList, setProjectsList] = useState<ProjectData[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectData>({
    title: '',
    description: '',
    technologies: [],
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    featured: false
  });
  const [techInput, setTechInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProjectsData();
  }, []);

  const fetchProjectsData = async () => {
    try {
      setIsLoading(true);
      const data = await getProjects();
      setProjectsList(data as ProjectData[]);
    } catch (error) {
      console.error("Error fetching projects data:", error);
      toast({
        title: "Error",
        description: "Could not fetch projects data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setCurrentProject(prev => ({
      ...prev,
      featured: checked
    }));
  };

  const handleAddTech = () => {
    if (techInput.trim() !== '') {
      setCurrentProject(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (index: number) => {
    setCurrentProject(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setCurrentProject({
      title: '',
      description: '',
      technologies: [],
      imageUrl: '',
      githubUrl: '',
      liveUrl: '',
      featured: false
    });
    setTechInput('');
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
  };

  const handleEdit = (item: ProjectData) => {
    setCurrentProject(item);
    setImagePreview(item.imageUrl || null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      await deleteDocument('projects', id);
      setProjectsList(prevList => prevList.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Project deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Could not delete project. Please try again.",
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
      let updatedImageUrl = currentProject.imageUrl || '';
      
      // Upload image if a new one was selected
      if (imageFile) {
        const timestamp = Date.now();
        const filePath = `project_images/${timestamp}_${imageFile.name}`;
        updatedImageUrl = await uploadFile(imageFile, filePath);
      }

      // Prepare data for update
      const dataToUpdate = {
        ...currentProject,
        imageUrl: updatedImageUrl,
      };

      if (isEditing && currentProject.id) {
        // Update existing record
        await updateDocument('projects', currentProject.id, dataToUpdate);
        setProjectsList(prevList => 
          prevList.map(item => 
            item.id === currentProject.id ? { ...dataToUpdate, id: item.id } : item
          )
        );
        toast({
          title: "Success",
          description: "Project updated successfully.",
        });
      } else {
        // Add new record
        const newDoc = await addDocument('projects', dataToUpdate);
        if (newDoc && newDoc.id) {
          setProjectsList(prevList => [...prevList, { ...dataToUpdate, id: newDoc.id }]);
        }
        toast({
          title: "Success",
          description: "Project added successfully.",
        });
      }
      
      // Reset the form
      resetForm();
    } catch (error) {
      console.error("Error saving project data:", error);
      toast({
        title: "Error",
        description: "Could not save project information. Please try again.",
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
          <CardTitle>{isEditing ? 'Edit Project' : 'Add Project'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Project Title
              </label>
              <Input
                id="title"
                name="title"
                value={currentProject.title}
                onChange={handleInputChange}
                required
                placeholder="Portfolio Website"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={currentProject.description}
                onChange={handleInputChange}
                rows={4}
                required
                placeholder="A detailed description of the project..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub URL (Optional)
                </label>
                <Input
                  id="githubUrl"
                  name="githubUrl"
                  value={currentProject.githubUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/yourusername/project"
                />
              </div>
              
              <div>
                <label htmlFor="liveUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Live URL (Optional)
                </label>
                <Input
                  id="liveUrl"
                  name="liveUrl"
                  value={currentProject.liveUrl}
                  onChange={handleInputChange}
                  placeholder="https://yourproject.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technologies Used
              </label>
              <div className="flex items-center gap-2 mb-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Add a technology"
                />
                <Button 
                  type="button" 
                  onClick={handleAddTech}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {currentProject.technologies.map((tech, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded-md px-3 py-1">
                    <span className="mr-2">{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(index)}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Project Image
              </label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className="mt-2">
                {(imagePreview || currentProject.imageUrl) && (
                  <div className="relative w-40 h-24 overflow-hidden rounded">
                    <img 
                      src={imagePreview || currentProject.imageUrl} 
                      alt="Project Preview" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={currentProject.featured}
                onCheckedChange={handleSwitchChange}
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                Featured Project
              </label>
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
                {isLoading ? 'Saving...' : isEditing ? 'Update' : 'Add Project'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projects List</CardTitle>
        </CardHeader>
        <CardContent>
          {projectsList.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No projects found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Technologies</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectsList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.featured ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.technologies.slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="bg-gray-100 text-xs rounded px-2 py-1">
                            {tech}
                          </span>
                        ))}
                        {item.technologies.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{item.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    </TableCell>
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

export default ProjectsAdmin;
