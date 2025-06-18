import type { EmailTemplate } from "@/types/outreach";

export const htmlTemplates: EmailTemplate[] = [
    {
        id: 1,
        name: "Initial Outreach - AI Engineer",
        subject: "Exciting AI Engineering Opportunity at {company}",
        content: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { color: #2563eb; font-size: 18px; font-weight: bold; margin-bottom: 15px; }
        .content { margin-bottom: 20px; }
        .highlights { background-color: #f8fafc; padding: 15px; border-left: 4px solid #2563eb; margin: 15px 0; }
        .highlights ul { margin: 0; padding-left: 20px; }
        .highlights li { margin-bottom: 5px; }
        .signature { margin-top: 20px; font-weight: 500; }
    </style>
</head>
<body>
    <div class="header">Hi {firstName},</div>
    
    <div class="content">
        I came across your profile and was impressed by your experience with <strong>{skills}</strong>. We have an exciting opportunity for a <strong>{position}</strong> role at <strong>{company}</strong> that I think would be a great fit for your background.
    </div>
    
    <div class="highlights">
        <strong>Key highlights:</strong>
        <ul>
            <li>Work on cutting-edge AI/ML projects</li>
            <li>Competitive salary: <strong>{salaryRange}</strong></li>
            <li>Remote-friendly culture</li>
            <li>Equity package included</li>
        </ul>
    </div>
    
    <div class="content">
        Would you be interested in a brief 15-minute call to discuss this opportunity?
    </div>
    
    <div class="signature">
        Best regards,<br>
        <strong>{recruiterName}</strong>
    </div>
</body>
</html>`,
        usage: 45,
        responseRate: 28,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z",
    },
    {
        id: 2,
        name: "Follow-up - No Response",
        subject: "Following up on {position} opportunity",
        content: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { color: #2563eb; font-size: 18px; font-weight: bold; margin-bottom: 15px; }
        .content { margin-bottom: 20px; }
        .benefits { background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .benefits ul { margin: 0; padding-left: 20px; }
        .benefits li { margin-bottom: 5px; color: #1e40af; }
        .signature { margin-top: 20px; font-weight: 500; }
        .casual { font-style: italic; color: #6b7280; }
    </style>
</head>
<body>
    <div class="header">Hi {firstName},</div>
    
    <div class="content">
        I wanted to follow up on my previous message about the <strong>{position}</strong> role at <strong>{company}</strong>. I understand you're likely busy, but I believe this opportunity could be a great next step in your career.
    </div>
    
    <div class="benefits">
        <strong>The role offers:</strong>
        <ul>
            <li>{keyBenefit1}</li>
            <li>{keyBenefit2}</li>
            <li>{keyBenefit3}</li>
        </ul>
    </div>
    
    <div class="content casual">
        If you're not interested, no worries at all. If you know someone who might be a good fit, I'd appreciate any referrals.
    </div>
    
    <div class="content">
        Thanks for your time!
    </div>
    
    <div class="signature">
        <strong>{recruiterName}</strong>
    </div>
</body>
</html>`,
        usage: 32,
        responseRate: 15,
        createdAt: "2024-01-05T00:00:00Z",
        updatedAt: "2024-01-20T00:00:00Z",
    },
];

export default htmlTemplates;
