import React, { useState, useEffect } from "react";
import { getEducation } from "@/services/firebase";
import { Card } from "@/components/ui/card";

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  logoUrl?: string;
}

const Education = () => {
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const data = await getEducation();
        setEducationList(data as EducationItem[]);
      } catch (error) {
        console.error("Error fetching education data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducationData();
  }, []);

  // Fallback data in case Firebase isn't configured yet
  const fallbackData: EducationItem[] = [
    {
      id: "1",
      degree: "Applied degree in information systems development.",
      institution: "Higher Institute of Technological Studies (ISET).",
      location: "Sfax, Tunisia",
      startDate: "2018",
      endDate: "2021",
      description:
        "Focuses on computer systems and software development, equipping students with the skills to develop and manage information systems through hands-on experience in programming, database management, and systems analysis.",
      logoUrl: "../images/iset.png",
    },
    {
      id: "2",
      degree: "Software Engineering",
      institution: "International Institute of Technology (IIT).",
      location: "Sfax, Tunisia",
      startDate: "2021",
      endDate: "2024",
      description:
        "Specialized in data science and software engineering. Providing students with the expertise to design and manage information systems through practical experience in programming, database management, data science and systems analysis.",
      logoUrl: "../images/iit.png",
    },
  ];

  const displayData = educationList.length > 0 ? educationList : fallbackData;

  return (
    <section id="education" className="py-24 bg-white">
      <div className="section-container animate-fade-in">
        <h2 className="section-title text-portfolio-blue">Education</h2>
        <p className="section-subtitle">
          My academic journey and qualifications
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {displayData.map((item, index) => (
            <Card
              key={item.id}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border-t-4 border-t-portfolio-blue animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="p-6">
                <div className="flex items-start mb-4">
                  {item.logoUrl && (
                    <div className="mr-4 flex-shrink-0">
                      <img
                        src={item.logoUrl}
                        alt={item.institution}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-portfolio-dark-blue">
                      {item.degree}
                    </h3>
                    <p className="text-portfolio-blue font-semibold">
                      {item.institution}
                    </p>
                    <p className="text-portfolio-gray">{item.location}</p>
                    <p className="text-sm text-portfolio-gray mt-1">
                      {item.startDate} - {item.endDate}
                    </p>
                  </div>
                </div>
                <p className="text-portfolio-dark-gray mt-4">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
