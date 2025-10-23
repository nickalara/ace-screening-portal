#!/bin/bash

# Test script to submit an application and trigger the email service

# Prepare the JSON payload
cat > /tmp/test-application.json <<'EOF'
{
  "fullName": "Nicholas Lara",
  "email": "nicholas.lara@startguides.com",
  "phone": "(555) 123-4567",
  "linkedin": "https://linkedin.com/in/nicklara",
  "q1_technical_learning": "I had to quickly learn a complex military training system when working on a project for DoD contractors. The system involved multiple integrated databases and simulation platforms. I approached it by first reviewing all available documentation, then setting up a test environment to experiment with the system hands-on. Within two weeks, I was able to create comprehensive training materials for end users.",
  "q2_field_work_comfort": "I have extensive experience working in field environments, including outdoor construction sites and industrial facilities. I am comfortable with physical work and have no limitations that would prevent me from climbing on equipment or working in austere conditions. I maintain physical fitness and have worked in various weather conditions.",
  "q3_ai_tools_proficiency": "I have extensive experience with AI tools including ChatGPT, Claude, and various low/no-code platforms. I use these tools daily for code generation, documentation writing, and problem-solving. I've built several automation workflows using AI-powered tools and understand how to prompt engineer effectively for optimal results.",
  "q4_communication_style": "I excel at remote communication and have managed multiple projects while working independently at client sites. I use Slack for daily updates, maintain detailed documentation in Notion, and schedule regular video check-ins with stakeholders. In one project, I worked solo at a military base for three months while coordinating with a remote team, delivering all milestones on time.",
  "q5_clearance_status": "eligible_willing",
  "q6_travel_willingness": "fully_available",
  "q7_motivation": "I am excited about StartGuides' mission to leverage AI for military training. The combination of hands-on fieldwork with cutting-edge AI development aligns perfectly with my technical skills and interest in defense applications. I'm particularly drawn to the opportunity to work directly with frontline personnel and see the immediate impact of my work."
}
EOF

# Submit the application using curl with multipart form data
curl -X POST http://localhost:3000/api/submit-application \
  -F "data=$(cat /tmp/test-application.json)" \
  -F "resume=@/Users/nlara/StartGuidesProjects/ace-screening-portal/test-resume.txt;type=text/plain"

echo ""
echo "Test application submitted. Check the server logs for email delivery status."
