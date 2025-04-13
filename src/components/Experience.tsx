import React, { useState, useEffect } from "react";
import { getExperience } from "@/services/firebase";
import { Card } from "@/components/ui/card";

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  responsibilities: string[];
  logoUrl?: string;
}

const Experience = () => {
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperienceData = async () => {
      try {
        const data = await getExperience();
        setExperienceList(data as ExperienceItem[]);
      } catch (error) {
        console.error("Error fetching experience data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperienceData();
  }, []);

  // Fallback data in case Firebase isn't configured yet
  const fallbackData: ExperienceItem[] = [
    {
      id: "1",
      title: "Full-stack Web developer (Java/Angular)",
      company: "Symatique",
      location: "Tunis, Tunisia",
      startDate: "October 2024",
      endDate: "Present",
      description:
        "Working on the development and maintenance of large, complex systems and ERP modules, including CRM, Orders, Manufacturing, Investment, and several other modules.",
      responsibilities: [
        "Creation and integration of new modules to improve system capabilities.",
        "Development of Web services for communication between Web systems and mobile applications.",
        "Addressing and fixing bugs based on customer feedback and test results.",
        "Keywords: Java/Jee, Ejb, Jsf, primefaces, Glassfish, Tomcat, Spring boot, Angular, SQL Server, Agile Kanban",
      ],
      logoUrl: "../images/symatique.png",
    },
    {
      id: "2",
      title:
        "Full-stack Web developer (Spring boot/Angular) Intern (Final-Year Engineering Project)",
      company: "Telnet",
      location: "Sfax, Tunisia",
      startDate: "February 2024",
      endDate: "May 2024",
      description:
        "Design, development and deploiement of a Web application dedicated to managing annual employee interviews.",
      responsibilities: [
        "Personalized interview tracking based on the company’s specific hierarchy.",
        "Modeling interview management processes using BPMN (Business Process Model and Notation) concepts.",
        "Automation of workflows to ensure smooth and structured interview management.",
        "Optimization of administrative tasks related to interviews, by reducing human errors.",
        "Keywords: Java, Spring boot, Spring Security, Camunda, Angular, BPMN, PostgeSQL, Docker, Agile Scrum.",
      ],
      logoUrl: "../images/telnet.jpg",
    },
    {
      id: "3",
      title: "Full-stack Web developer (Laravel/Vue js) Intern",
      company: "Piximid",
      location: "Sfax, Tunisia",
      startDate: "July 2023",
      endDate: "August 2023",
      description:
        "Design and development of a web application dedicated to restaurant management.",
      responsibilities: [
        "Centralized restaurant management, including menus, reservations and users.",
        "Real-time order tracking to improve service responsiveness.",
        "Optimizing the ordering process for a better customer experience.",
        "Integration of notifications to inform about the status of orders.",
        "Keywords: Php, Laravel, Vue js, Atomic Design, Agile Scrum",
      ],
      logoUrl: "../images/piximind.jpg",
    },
  ];

  const displayData = experienceList.length > 0 ? experienceList : fallbackData;

  return (
    <section id="experience" className="py-24 bg-portfolio-light-gray">
      <div className="section-container animate-fade-in">
        <h2 className="section-title text-portfolio-blue">Work Experience</h2>
        <p className="section-subtitle">
          My professional journey and career highlights
        </p>

        <div className="space-y-12 mt-12">
          {displayData.map((item, index) => (
            <Card
              key={item.id}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border-l-4 border-l-portfolio-blue animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start">
                  {item.logoUrl && (
                    <div className="mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                      <img
                        src={item.logoUrl}
                        alt={item.company}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </div>
                  )}

                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-portfolio-dark-blue">
                          {item.title}
                        </h3>
                        <p className="text-portfolio-blue font-semibold">
                          {item.company}
                        </p>
                        <p className="text-portfolio-gray">{item.location}</p>
                      </div>
                      <p className="text-portfolio-gray mt-2 md:mt-0 md:text-right">
                        {item.startDate} - {item.endDate}
                      </p>
                    </div>

                    <p className="text-portfolio-dark-gray mt-4">
                      {item.description}
                    </p>

                    <div className="mt-4">
                      <h4 className="font-semibold text-portfolio-dark-blue mb-2">
                        Key Responsibilities:
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {item.responsibilities.map((responsibility, idx) => (
                          <li key={idx} className="text-portfolio-dark-gray">
                            {responsibility}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
