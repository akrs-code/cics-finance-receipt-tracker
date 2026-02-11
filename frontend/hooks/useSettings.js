import { useState } from "react";

export function useSettings() {
    const [councilMembers, setCouncilMembers] = useState(() => {
        const saved = localStorage.getItem("councilMembers");
        return saved ? JSON.parse(saved) : [{ name: "Amnisa D. Arsa", position: "Chief Minister" },
        { name: "Nor-Ainie T. Macalatas", position: "Executive Secretary" },
        { name: "Raisha M. Matonding", position: "Assistant Secretary" },
        { name: "Janna M. Barsi", position: "Associate Justice" },
        { name: "Alexsarah D.C. Racman", position: "Speaker of the Parliament" },
        { name: "Peejay C. Patos", position: "DCS Society Head" },
        { name: "Saibah H.O. Saidamen", position: "DIS Society Head" },
        { name: "Norhadi M. Norodin", position: "CSRAW Commissioner" },
        { name: "Sittie Aisha C. Abdulmanan", position: "Minister of Audit" },
        { name: "Mohammad Hosni M. Palantig", position: "Minister of Public Affairs" },
        { name: "Amal O. Sultan", position: "Minister of Finance" },
        { name: "Hafsah R. Mangorangca", position: "Minister of Academic Affairs" },
        { name: "Jehan Fatmah P. Radiamoda", position: "Minister of Sports and Recreation" },
        { name: "Sarhan G. Mundig", position: "Minister of Press & Information" },
        { name: "Honey Jane B. Mamac", position: "Minister of Documentation" },
        { name: "Mohammad M. Camid", position: "Minister of Business Operation" },
        { name: "Al-Banie M. Agakhan", position: "SSG Representative" },
        { name: "John Warren A. Villarta", position: "SSG Representative" },
        { name: "Mohammad Zulkifli S. Macadato", position: "Deputy Minister of Public Affairs" },
        { name: "Omar O. Batocala", position: "Deputy Minister of Academic Affairs" },
        { name: "Asnawi L. Hassan", position: "Deputy Minister of Press & Information" },
        { name: "Rahimah H.R. H.Jamel", position: "Deputy Minister of Documentation" },
        { name: "Fahad M. Baraiman", position: "Deputy Minister of Business Operation" },
        { name: "Hafiz M. Daison", position: "Technical Director" },
        { name: "Crysttel Angeline B. Ali", position: "Public Information Officer" },
        { name: "Abdul-khaliq R. Solaiman", position: "Operation Officer of Press & Information" },
        { name: "Nasrimah L. Nasroden", position: "Secretary of Financial Records" },
        { name: "Norfaida P. Abdulcadir", position: "Secretary of Funds and Expenditures" },
        { name: "Wassim D. Alikhan", position: "Associate Minister of Business Operation" }];
    });
    const [audits, setAudits] = useState(() => {
        const saved = localStorage.getItem("Audits");
        return saved ? JSON.parse(saved) : [
            { name: "Sittie Aisha C. Abdulmanan", position: "Minister of Audit" },
        ]
    });

    const [units, setUnits] = useState(() => {
        const saved = localStorage.getItem("units");
        return saved ? JSON.parse(saved) : ["pc", "kg", "pack", "bottle", "liter"];
    });

    const updateMembers = (newList) => {
        setCouncilMembers(newList);
        localStorage.setItem("councilMembers", JSON.stringify(newList));
    };
    const updateAudits = (newList) => {
        setAudits(newList);
        localStorage.setItem("Audits", JSON.stringify(newList));
    };
    const updateUnits = (newList) => {
        setUnits(newList);
        localStorage.setItem("units", JSON.stringify(newList));
    };

    return { councilMembers, units, audits, updateMembers, updateUnits, updateAudits };
}