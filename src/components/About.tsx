import React, { useState, useEffect } from "react";
import { getAboutMe } from "@/services/firebase";
import { Card } from "@/components/ui/card";

interface AboutData {
  id: string;
  name: string;
  title: string;
  bio: string;
  skills: string[];
  photoUrl: string;
}

const About = () => {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback data in case Firebase isn't configured yet
  const fallbackData: AboutData = {
    id: "1",
    name: "Mohamed Tijani Daoud",
    title: "Full-Stack software Engineer (Java/Angular)",
    bio:
      "I am a Full Stack Software Engineer with a passion for creating innovative applications.\n" +
      "I specialize in utilizing robust and scalable technologies like Java/JEE, Spring Boot, and Angular to build responsive web applications.\n" +
      "I am committed to staying up-to-date with the latest industry trends and delivering solutions that are scalable, secure, and highly available.\n" +
      "I value collaboration, communication, and creativity, and I am always eager to learn and improve.",
    skills: [
      "Java",
      "JEE",
      "EJB",
      "JSF",
      "Spring boot",
      "JavaScript",
      "TypeScript",
      "React",
      "Angular",
      "Node.js",
      "SQL server",
      "SQL",
      "Firebase",
      "MongoDB",
    ],
    photoUrl: "../images/profil.png",
  };

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await getAboutMe();
        if (data) {
          // Treating the data as any to bypass type checking initially
          const rawData = data as any;
          
          // Create a properly typed object
          const mappedData: AboutData = {
            id: rawData.id || fallbackData.id,
            name: rawData.name || fallbackData.name,
            title: rawData.title || fallbackData.title,
            bio: rawData.bio || fallbackData.bio,
            skills: Array.isArray(rawData.skills) ? rawData.skills : fallbackData.skills,
            photoUrl: rawData.photoUrl || rawData.imageUrl || fallbackData.photoUrl
          };
          
          setAbout(mappedData);
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const displayData = about || fallbackData;

  return (
    <section
      id="about"
      className="min-h-screen pt-24 bg-gradient-to-b from-white to-portfolio-light-gray"
    >
      <div className="section-container animate-fade-in">
        <h2 className="section-title text-portfolio-blue">About Me</h2>

        <div className="flex flex-col lg:flex-row items-center gap-12 mt-16">
          {/* Profile Image */}
          <div className="w-full lg:w-1/3 flex justify-center">
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-portfolio-blue shadow-xl">
              <img
                src={displayData.photoUrl}
                alt={displayData.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Bio Information */}
          <div className="w-full lg:w-2/3">
            <h3 className="text-3xl font-bold text-portfolio-dark-blue mb-2">
              {displayData.name}
            </h3>
            <p className="text-xl text-portfolio-blue mb-6">
              {displayData.title}
            </p>
            <p className="text-lg text-portfolio-dark-gray mb-8 leading-relaxed">
              {displayData.bio}
            </p>

            {/* Skills */}
            <div>
              <h4 className="text-xl font-semibold text-portfolio-dark-blue mb-4">
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {displayData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white rounded-full text-portfolio-blue border border-portfolio-light-blue shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
