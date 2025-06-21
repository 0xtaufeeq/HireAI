"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
    Search,
    Filter,
    MapPin,
    Clock,
    Users,
    Building,
    GraduationCap,
    Loader2,
    Check,
    Briefcase,
    Target,
    Code,
} from "lucide-react";
import Link from "next/link";

interface Candidate {
    id: string;
    name: string;
    title: string;
    company: string;
    location: string;
    experience: string;
    education: string;
    skills: string[];
    email: string;
    phone: string;
    summary: string;
    image: string;
    gender: string;
    ethnicity: string;
}

interface DetectedCriteria {
    location: boolean;
    jobTitle: boolean;
    experience: boolean;
    industry: boolean;
    skills: boolean;
}

export default function SearchPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [experienceRange, setExperienceRange] = useState([1, 15]);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
    const [selectedEthnicities, setSelectedEthnicities] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [detectedCriteria, setDetectedCriteria] = useState<DetectedCriteria>({
        location: false,
        jobTitle: false,
        experience: false,
        industry: false,
        skills: false,
    });

    // Load candidates data
    useEffect(() => {
        const loadCandidates = async () => {
            try {
                const response = await fetch("/data/indian-candidates.json");
                const data = await response.json();
                setCandidates(data);
                setFilteredCandidates(data);
                setLoading(false);
            } catch (error) {
                console.error("Error loading candidates:", error);
                setLoading(false);
            }
        };

        loadCandidates();
    }, []);

    // Analyze search query for detected criteria
    const analyzeSearchQuery = (query: string) => {
        const lowerQuery = query.toLowerCase();

        // Location patterns
        const locationKeywords = [
            "bangalore",
            "mumbai",
            "delhi",
            "chennai",
            "hyderabad",
            "pune",
            "kolkata",
            "ahmedabad",
            "kochi",
            "jaipur",
            "mysore",
            "coimbatore",
            "thiruvananthapuram",
            "bay area",
            "silicon valley",
            "california",
            "new york",
            "london",
            "remote",
            "gurgaon",
            "noida",
            "indore",
            "bhubaneswar",
            "chandigarh",
            "nagpur",
            "surat",
        ];

        // Job title patterns - expanded for all fields
        const jobTitleKeywords = [
            // Technology
            "engineer",
            "developer",
            "architect",
            "devops",
            "data scientist",
            "ai",
            "ml",
            // Product & Management
            "product manager",
            "manager",
            "director",
            "analyst",
            "lead",
            "senior",
            "junior",
            "principal",
            "consultant",
            "specialist",
            "coordinator",
            "executive",
            // Sales & Marketing
            "sales",
            "marketing",
            "account",
            "business development",
            "growth",
            "digital marketing",
            "content",
            "social media",
            "seo",
            "sem",
            "brand",
            "performance marketing",
            // Finance & Operations
            "financial",
            "finance",
            "controller",
            "cfo",
            "operations",
            "supply chain",
            "logistics",
            "audit",
            "risk",
            "treasury",
            "budget",
            "investment",
            "credit",
            // HR & Legal
            "hr",
            "human resources",
            "talent",
            "recruiter",
            "recruiting",
            "legal",
            "counsel",
            "compliance",
            "contract",
            "regulatory",
            "employment",
            "benefits",
            // Design & Creative
            "designer",
            "design",
            "creative",
            "ui",
            "ux",
            "visual",
            "graphic",
            "brand designer",
            "art director",
            "motion graphics",
            "interaction design",
            // Consulting & Strategy
            "consultant",
            "strategy",
            "transformation",
            "process improvement",
            "change management",
            // Healthcare & Education
            "healthcare",
            "medical",
            "clinical",
            "pharmaceutical",
            "training",
            "learning",
            "education",
            "curriculum",
            "instructional",
        ];

        // Experience patterns
        const experiencePatterns = [
            /\d+\s*(year|yr|yrs|years?)/i,
            /(fresh|fresher|entry.level|junior|senior|mid.level|experienced)/i,
            /(\d+)\+?\s*(year|yr|yrs|years?)/i,
        ];

        // Industry patterns - greatly expanded
        const industryKeywords = [
            // Technology
            "fintech",
            "tech",
            "technology",
            "startup",
            "saas",
            "software",
            "it",
            // Finance & Banking
            "finance",
            "banking",
            "financial services",
            "insurance",
            "investment",
            "private equity",
            "venture capital",
            "asset management",
            // Consulting & Professional Services
            "consulting",
            "professional services",
            "advisory",
            "strategy",
            // Healthcare & Pharma
            "healthcare",
            "pharma",
            "pharmaceutical",
            "medical",
            "biotech",
            "life sciences",
            // E-commerce & Retail
            "ecommerce",
            "e-commerce",
            "retail",
            "consumer goods",
            "fmcg",
            // Manufacturing & Industrial
            "manufacturing",
            "automotive",
            "industrial",
            "chemicals",
            "steel",
            "textiles",
            // Media & Entertainment
            "media",
            "entertainment",
            "gaming",
            "publishing",
            "advertising",
            "marketing",
            // Education & Training
            "education",
            "edtech",
            "training",
            "learning",
            "academic",
            // Government & Public Sector
            "government",
            "public sector",
            "ngo",
            "non-profit",
            // Real Estate & Construction
            "real estate",
            "construction",
            "infrastructure",
            "property",
            // Energy & Utilities
            "energy",
            "utilities",
            "oil",
            "gas",
            "renewable",
            "solar",
            "wind",
        ];

        // Skills patterns - expanded for all fields
        const skillKeywords = [
            // Technology Skills
            "react",
            "angular",
            "vue",
            "javascript",
            "typescript",
            "python",
            "java",
            "node",
            "express",
            "spring",
            "django",
            "mongodb",
            "sql",
            "postgresql",
            "aws",
            "azure",
            "docker",
            "kubernetes",
            "git",
            "agile",
            "scrum",
            "machine learning",
            "ai",
            "data science",
            "devops",
            "frontend",
            "backend",
            // Product & Analytics
            "product management",
            "analytics",
            "data analysis",
            "market research",
            "user research",
            "a/b testing",
            "roadmap",
            "wireframing",
            "prototyping",
            // Marketing & Sales
            "digital marketing",
            "seo",
            "sem",
            "google ads",
            "facebook ads",
            "content marketing",
            "email marketing",
            "social media",
            "crm",
            "salesforce",
            "hubspot",
            "lead generation",
            "account management",
            "business development",
            "sales strategy",
            // Finance & Operations
            "financial modeling",
            "excel",
            "powerpoint",
            "budgeting",
            "forecasting",
            "financial analysis",
            "sap",
            "oracle",
            "accounting",
            "audit",
            "compliance",
            "supply chain",
            "logistics",
            "operations",
            "process improvement",
            "lean six sigma",
            // HR & Legal
            "talent acquisition",
            "recruiting",
            "hris",
            "performance management",
            "employee relations",
            "compensation",
            "benefits",
            "learning development",
            "contract law",
            "corporate law",
            "compliance",
            "legal research",
            // Design & Creative
            "figma",
            "sketch",
            "adobe creative suite",
            "photoshop",
            "illustrator",
            "ui design",
            "ux design",
            "visual design",
            "graphic design",
            "brand design",
            "prototyping",
            "user experience",
            "design systems",
            "wireframing",
            // Consulting & Strategy
            "strategy development",
            "business analysis",
            "change management",
            "project management",
            "stakeholder management",
            "process consulting",
        ];

        const detected = {
            location: locationKeywords.some((keyword) => lowerQuery.includes(keyword)),
            jobTitle: jobTitleKeywords.some((keyword) => lowerQuery.includes(keyword)),
            experience: experiencePatterns.some((pattern) => pattern.test(lowerQuery)),
            industry: industryKeywords.some((keyword) => lowerQuery.includes(keyword)),
            skills: skillKeywords.some((keyword) => lowerQuery.includes(keyword)),
        };

        setDetectedCriteria(detected);
    };

    // Update analysis when query changes
    useEffect(() => {
        analyzeSearchQuery(searchQuery);
    }, [searchQuery]);

    // AI-powered search function
    const performAISearch = async (query: string) => {
        if (!query.trim()) {
            setFilteredCandidates(applyFilters(candidates));
            return;
        }

        setSearching(true);
        try {
            const response = await fetch("/api/ai-search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: query,
                    candidates: candidates,
                }),
            });

            if (response.ok) {
                const results = await response.json();
                const filteredResults = applyFilters(results.candidates);
                setFilteredCandidates(filteredResults);
            } else {
                setFilteredCandidates(applyFilters(candidates));
            }
        } catch (error) {
            console.error("AI search error:", error);
            setFilteredCandidates(applyFilters(candidates));
        } finally {
            setSearching(false);
        }
    };

    // Apply filters to candidates
    const applyFilters = (candidateList: Candidate[]) => {
        let filtered = candidateList;

        // Experience filter
        filtered = filtered.filter((candidate) => {
            const experience = parseInt(candidate.experience);
            return experience >= experienceRange[0] && experience <= experienceRange[1];
        });

        // Location filter
        if (selectedLocations.length > 0) {
            filtered = filtered.filter((candidate) =>
                selectedLocations.some((location) => candidate.location.includes(location))
            );
        }

        // Gender filter
        if (selectedGenders.length > 0) {
            filtered = filtered.filter((candidate) => selectedGenders.includes(candidate.gender));
        }

        // Ethnicity filter
        if (selectedEthnicities.length > 0) {
            filtered = filtered.filter((candidate) =>
                selectedEthnicities.includes(candidate.ethnicity)
            );
        }

        return filtered;
    };

    // Handle search
    const handleSearch = async () => {
        await performAISearch(searchQuery);
    };

    // Apply filters when dependencies change
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredCandidates(applyFilters(candidates));
        } else {
            performAISearch(searchQuery);
        }
    }, [experienceRange, selectedLocations, selectedGenders, selectedEthnicities]);

    const handleLocationFilter = (location: string, checked: boolean) => {
        if (checked) {
            setSelectedLocations([...selectedLocations, location]);
        } else {
            setSelectedLocations(selectedLocations.filter((l) => l !== location));
        }
    };

    const handleGenderFilter = (gender: string, checked: boolean) => {
        if (checked) {
            setSelectedGenders([...selectedGenders, gender]);
        } else {
            setSelectedGenders(selectedGenders.filter((g) => g !== gender));
        }
    };

    const handleEthnicityFilter = (ethnicity: string, checked: boolean) => {
        if (checked) {
            setSelectedEthnicities([...selectedEthnicities, ethnicity]);
        } else {
            setSelectedEthnicities(selectedEthnicities.filter((e) => e !== ethnicity));
        }
    };

    // Get unique values for filters
    const uniqueLocations = Array.from(new Set(candidates.map((c) => c.location.split(",")[0])));
    const uniqueGenders = Array.from(new Set(candidates.map((c) => c.gender)));
    const uniqueEthnicities = Array.from(new Set(candidates.map((c) => c.ethnicity)));

    const clearAllFilters = () => {
        setSelectedLocations([]);
        setSelectedGenders([]);
        setSelectedEthnicities([]);
        setExperienceRange([1, 15]);
        setSearchQuery("");
        setFilteredCandidates(candidates);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">Search Candidates</h1>
                    <p className="text-muted-foreground">
                        Finding the perfect talent for your team
                    </p>
                </div>
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold">Search Candidates</h1>
                <p className="text-muted-foreground">
                    Find the perfect talent using AI-powered search
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {filteredCandidates.length} of {candidates.length} candidates
                    </span>
                </div>
            </div>

            {/* Search Bar */}
            <div className="space-y-4">
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Try: Software Engineers with 5+ yrs of experience at fintech companies in the Bay Area"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                            className="pl-9 h-12 text-base"
                        />
                    </div>
                    <Button onClick={handleSearch} disabled={searching} size="lg">
                        {searching ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Search className="h-4 w-4" />
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        size="lg"
                    >
                        <Filter className="h-4 w-4" />
                        {showFilters && "Hide "}Filters
                    </Button>
                </div>

                {/* Detected Criteria Indicators */}
                {searchQuery && (
                    <div className="flex flex-wrap gap-3 px-1">
                        <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
                                detectedCriteria.location
                                    ? "bg-green-300 text-green-900 border border-green-200"
                                    : "bg-gray-100 text-gray-500 border border-gray-200"
                            }`}
                        >
                            {detectedCriteria.location ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <MapPin className="h-4 w-4" />
                            )}
                            Location
                        </div>

                        <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
                                detectedCriteria.jobTitle
                                    ? "bg-green-300 text-green-900 border border-green-200"
                                    : "bg-gray-100 text-gray-500 border border-gray-200"
                            }`}
                        >
                            {detectedCriteria.jobTitle ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <Briefcase className="h-4 w-4" />
                            )}
                            Job Title
                        </div>

                        <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
                                detectedCriteria.experience
                                    ? "bg-green-300 text-green-900 border border-green-200"
                                    : "bg-gray-100 text-gray-500 border border-gray-200"
                            }`}
                        >
                            {detectedCriteria.experience ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <Clock className="h-4 w-4" />
                            )}
                            Years of Experience
                        </div>

                        <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
                                detectedCriteria.industry
                                    ? "bg-green-300 text-green-900 border border-green-200"
                                    : "bg-gray-100 text-gray-500 border border-gray-200"
                            }`}
                        >
                            {detectedCriteria.industry ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <Target className="h-4 w-4" />
                            )}
                            Industry
                        </div>

                        <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
                                detectedCriteria.skills
                                    ? "bg-green-300 text-green-900 border border-green-200"
                                    : "bg-gray-100 text-gray-500 border border-gray-200"
                            }`}
                        >
                            {detectedCriteria.skills ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <Code className="h-4 w-4" />
                            )}
                            Skills
                        </div>
                    </div>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
                {/* Filters Sidebar */}
                {showFilters && (
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="p-4 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">Filters</h3>
                                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                                        Clear All
                                    </Button>
                                </div>

                                {/* Experience Range */}
                                <div className="space-y-3">
                                    <Label className="text-sm">
                                        Experience ({experienceRange[0]}-{experienceRange[1]} years)
                                    </Label>
                                    <Slider
                                        value={experienceRange}
                                        onValueChange={setExperienceRange}
                                        max={15}
                                        min={1}
                                        step={1}
                                        className="w-full"
                                    />
                                </div>

                                {/* Location Filter */}
                                <div className="space-y-3">
                                    <Label className="text-sm">Location</Label>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {uniqueLocations.slice(0, 10).map((location) => (
                                            <div
                                                key={location}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={`location-${location}`}
                                                    checked={selectedLocations.includes(location)}
                                                    onCheckedChange={(checked) =>
                                                        handleLocationFilter(
                                                            location,
                                                            checked as boolean
                                                        )
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`location-${location}`}
                                                    className="text-xs font-normal"
                                                >
                                                    {location}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Gender Filter */}
                                <div className="space-y-3">
                                    <Label className="text-sm">Gender</Label>
                                    <div className="space-y-2">
                                        {uniqueGenders.map((gender) => (
                                            <div
                                                key={gender}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={`gender-${gender}`}
                                                    checked={selectedGenders.includes(gender)}
                                                    onCheckedChange={(checked) =>
                                                        handleGenderFilter(
                                                            gender,
                                                            checked as boolean
                                                        )
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`gender-${gender}`}
                                                    className="text-xs font-normal"
                                                >
                                                    {gender}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Regional Background Filter */}
                                <div className="space-y-3">
                                    <Label className="text-sm">Regional Background</Label>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                        {uniqueEthnicities.map((ethnicity) => (
                                            <div
                                                key={ethnicity}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={`ethnicity-${ethnicity}`}
                                                    checked={selectedEthnicities.includes(
                                                        ethnicity
                                                    )}
                                                    onCheckedChange={(checked) =>
                                                        handleEthnicityFilter(
                                                            ethnicity,
                                                            checked as boolean
                                                        )
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`ethnicity-${ethnicity}`}
                                                    className="text-xs font-normal"
                                                >
                                                    {ethnicity}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Results */}
                <div className={`space-y-4 ${showFilters ? "lg:col-span-3" : "lg:col-span-4"}`}>
                    {filteredCandidates.length === 0 ? (
                        <Card>
                            <CardContent className="py-12">
                                <div className="text-center">
                                    <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="font-medium mb-2">No candidates found</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Try adjusting your search or filters
                                    </p>
                                    <Button variant="outline" onClick={clearAllFilters}>
                                        Clear filters
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredCandidates.map((candidate) => (
                            <Card key={candidate.id} className="hover:shadow-sm transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage
                                                src={candidate.image}
                                                alt={candidate.name}
                                            />
                                            <AvatarFallback>
                                                {candidate.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-2">
                                            <div>
                                                <Link
                                                    href={`/candidates/${candidate.id}`}
                                                    className="font-medium hover:text-primary"
                                                >
                                                    {candidate.name}
                                                </Link>
                                                <p className="text-sm text-muted-foreground">
                                                    {candidate.title}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Building className="h-4 w-4" />
                                                    {candidate.company}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {candidate.location}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {candidate.experience}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm">
                                                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-muted-foreground">
                                                    {candidate.education}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-1">
                                                {candidate.skills
                                                    .slice(0, 4)
                                                    .map((skill, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                {candidate.skills.length > 4 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{candidate.skills.length - 4} more
                                                    </Badge>
                                                )}
                                            </div>

                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {candidate.summary}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
