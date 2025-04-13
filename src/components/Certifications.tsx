import React, { useState, useEffect } from "react";
import { getCertifications } from "@/services/firebase";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  skills: string[];
  logoUrl?: string;
}

const Certifications = () => {
  const [certificationsList, setCertificationsList] = useState<
    CertificationItem[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificationsData = async () => {
      try {
        const data = await getCertifications();
        setCertificationsList(data as CertificationItem[]);
      } catch (error) {
        console.error("Error fetching certifications data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificationsData();
  }, []);

  // Fallback data in case Firebase isn't configured yet
  const fallbackData: CertificationItem[] = [
    {
      id: "1",
      title: "Big Data Engineer IBM",
      issuer: "IBM",
      issueDate: "December 2023",
      expiryDate: "valid for a lifetime",
      //credentialId: "AWS-ASA-12345",
      //credentialUrl: "https://aws.amazon.com/certification/",
      skills: ["Hadoop", "HDFS", "MapReduce", "Zookeeper"],
      logoUrl: "../images/bigdata.png",
    },
    {
      id: "2",
      title: "Certifiation en Francais Delf niveau B2",
      issuer: "French Ministry of National Education",
      issueDate: "February 2023",
      //credentialId: "GCP-PCD-67890",
      //credentialUrl: "https://cloud.google.com/certification",
      skills: ["Google Cloud Platform", "Cloud Development", "Kubernetes"],
      logoUrl: "../images/delf.png",
    },
    {
      id: "3",
      title: "CCNAv7 (CISCO)",
      issuer: "Cisco Networking Acedemy",
      issueDate: "Augest 2022",
      //credentialId: "GCP-PCD-67890",
      //credentialUrl: "https://cloud.google.com/certification",
      skills: [
        "TCP/IP protocols",
        "subnetting",
        "interpret network diagrams and schematics",
        "network designs",
      ],
      logoUrl: "../images/ccna.png",
    },
  ];

  const displayData =
    certificationsList.length > 0 ? certificationsList : fallbackData;

  return (
    <section id="certifications" className="py-24 bg-white">
      <div className="section-container animate-fade-in">
        <h2 className="section-title text-portfolio-blue">Certifications</h2>
        <p className="section-subtitle">
          Professional certifications and credentials
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {displayData.map((item, index) => (
            <Card
              key={item.id}
              className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white border border-gray-200 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                <div className="flex items-center justify-center mb-6 h-16">
                  {item.logoUrl ? (
                    <img
                      src={item.logoUrl}
                      alt={item.issuer}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-portfolio-light-blue rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {item.issuer.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-portfolio-dark-blue text-center mb-2">
                  {item.title}
                </h3>
                <p className="text-portfolio-blue text-center">{item.issuer}</p>

                <div className="mt-4 text-sm text-portfolio-gray text-center">
                  <p>Issued: {item.issueDate}</p>
                  {item.expiryDate && <p>Expires: {item.expiryDate}</p>}
                  {item.credentialId && (
                    <p>Credential ID: {item.credentialId}</p>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {item.skills.map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="bg-portfolio-light-gray text-portfolio-dark-gray"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                {item.credentialUrl && (
                  <div className="mt-6 text-center">
                    <a
                      href={item.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-portfolio-blue hover:text-portfolio-dark-blue font-medium"
                    >
                      Verify Credential{" "}
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
