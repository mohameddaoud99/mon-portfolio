
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { getAboutMe, updateDocument, uploadFile } from '@/services/firebase';
import { AboutData } from '@/types/admin';

const AboutAdmin = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [aboutData, setAboutData] = useState<AboutData>({
    name: '',
    title: '',
    bio: '',
    skills: [],
    photoUrl: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setIsLoading(true);
        const data = await getAboutMe();
        if (data) {
          setAboutData(data as AboutData);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
        toast({
          title: "Error",
          description: "Could not fetch about data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAboutData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() !== '') {
      setAboutData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setPhotoPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let updatedPhotoUrl = aboutData.photoUrl;
      
      // Upload photo if a new one was selected
      if (photoFile) {
        const timestamp = Date.now();
        const filePath = `profile_photos/${timestamp}_${photoFile.name}`;
        updatedPhotoUrl = await uploadFile(photoFile, filePath);
      }

      // Prepare data for update
      const dataToUpdate = {
        ...aboutData,
        photoUrl: updatedPhotoUrl,
        updatedAt: new Date()
      };

      // Update the document
      if (aboutData.id) {
        await updateDocument('about', aboutData.id, dataToUpdate);
      } else {
        // If no id exists, this would be a new record
        await updateDocument('about', 'profile', dataToUpdate);
      }

      toast({
        title: "Success",
        description: "About information updated successfully.",
      });
    } catch (error) {
      console.error("Error updating about data:", error);
      toast({
        title: "Error",
        description: "Could not update about information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              value={aboutData.name}
              onChange={handleInputChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Professional Title
            </label>
            <Input
              id="title"
              name="title"
              value={aboutData.title}
              onChange={handleInputChange}
              required
              placeholder="Software Engineer"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Biography
            </label>
            <Textarea
              id="bio"
              name="bio"
              value={aboutData.bio}
              onChange={handleInputChange}
              rows={5}
              required
              placeholder="Write a short bio about yourself..."
            />
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
              {aboutData.skills.map((skill, index) => (
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
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
              Profile Photo
            </label>
            <Input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            <div className="mt-3">
              {(photoPreview || aboutData.photoUrl) && (
                <div className="relative w-24 h-24 overflow-hidden rounded-full">
                  <img 
                    src={photoPreview || aboutData.photoUrl} 
                    alt="Profile Preview" 
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-portfolio-blue hover:bg-portfolio-dark-blue"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AboutAdmin;
