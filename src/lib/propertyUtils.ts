import properties from "@/constans/propertiesData";


// Gets all unique districts for a given city

function getDistricts(city: string): string[] {
    const cityProperties = properties.filter(property => property.city === city);
    return Array.from(new Set(cityProperties.map(prop => prop.district)));
}


// Gets all unique cities from the properties data

function getUniqueCities(): string[] {
    return Array.from(new Set(properties.map(property => property.city)));
}

export { getDistricts, getUniqueCities };