/* ===================================================================
   content.js : ALL the site's content lives in this file.
   Add / hide (visible:false) / reorder (order) anything here and every
   page rebuilds itself. Image paths are relative to the site root.
   =================================================================== */

/* ---------- PROJECTS ----------
   One object per project. Each project page is projects/<slug>.html.
   Page body = list of blocks: image, split, trio, cards, gallery, close.
   Leave pdf:"" to hide the Download PDF button (set to e.g. "pdf/virgin-money.pdf"). */
var PROJECTS=[
{slug:"digital-advertising",order:10,visible:true,title:"Digital advertising",tag:"Ad campaigns",cardTag:"Coming soon",thumb:"images/digital-advertising.webp",
 meta:[["Studio","Ozone"],["Role","Midweight Designer"],["Focus","Digital advertising"],["Year","20XX"]],
 behance:"https://www.behance.net/ollyrav",pdf:"",
 blocks:[
 {type:"image",slot:"Hero image",src:"images/digital-advertising.webp"},
 {type:"split",label:"overview.",lead:"Add a one-line summary of the campaign work here.",text:["Placeholder: the overview goes here."]},
 {type:"trio",label:"goal, approach, creative.",items:[
  {h:"Goal",todo:true,t:"Add the campaign goal."},
  {h:"How the creative delivered",todo:true,t:"Add how the creative delivered against the goal."},
  {h:"Creative",todo:true,t:"Add the creative and any links."}]},
 {type:"image",n:2,slot:"Campaign creative",caption:"Campaign creative"}
 ]},
{slug:"virgin-money",order:20,visible:true,title:"Virgin Money Brighter Future Zone",tag:"Website UI",cardTag:"Website UI",thumb:"images/vm-brighter-future-zone.webp",
 meta:[["Client","Virgin Money"],["Studio","Life Moments"],["Role","UI design"],["Year","20XX"]],
 behance:"https://www.behance.net/ollyrav",pdf:"",
 blocks:[
{type:"image",slot:"Hero image: tablet + phone mockup",src:"images/vm-brighter-future-zone.webp",caption:"Main dashboard where users can find links to all of the tools and content within the site, and the digital coach, Brightly, to direct them into their next task"},
{type:"split",label:"overview.",lead:"Come with me and we will explore a range of investment tools and tips to help you discover your inner investor!",text:["The Brighter Future Zone is a set of investment tools and content, guided by a digital coach called Brightly."]},
{type:"split",label:"The digital coach, ‘Brightly’.",lead:"Hello, I'm Brightly, your investment coach!",text:["Are you ready to build your brighter future with Virgin Money?","As you complete a tool, scroll down the results page and you will see me re-appear, ready and waiting to move you on to the next tool. It’s super simple. Also, don’t forget, you don’t have to complete all of the tools at once. You can come back and pick up where you left off whenever you’re ready."],slot:"Brightly intro screen"},
{type:"cards",label:"the tools.",items:[
{t:"Financial Health Check",d:"A simple quiz designed to assess the user’s current financial situation and provide a set of actions for them to address before they should consider investing, with links providing guidance on how to do this."},
{t:"Inflation poll",d:"Take our poll to see how different inflation rates could affect what you’re able to buy with your savings."},
{t:"Investor quiz",d:"Take our quiz to find out what kind of investor you might be."},
{t:"Brighter Future Goals",d:"A simple calculator to encourage users to start thinking about their future goals and consider the amount of money they need to save to achieve them, offering further guidance on how investing might be able to help."}]},
{type:"split",label:"responsive + accessible.",lead:"Accessibility at the forefront of the design process.",text:["The Brighter Future Zone website has been designed to be fully responsive across small, medium and large breakpoints, with accessibility at the forefront of the design process. So the entire functionality of the site, including all tools and content, can be displayed on any device."],imgs:3,slot:"Small / medium / large breakpoint"},
{type:"image",n:2,slot:"Article page",caption:"Article page: ‘What’s an investment strategy and how do I make one?’"}
 ]},
{slug:"firsthomecoach",order:30,visible:true,title:"FirstHomeCoach",tag:"Brand & UI",cardTag:"UI + Branding",thumb:"images/firsthomecoach.webp",
 meta:[["Studio","Life Moments"],["Role","UI design + brand assets"],["Platform","App + web"],["Duration","18+ months"]],
 behance:"https://www.behance.net/ollyrav",pdf:"",
 blocks:[
{type:"image",slot:"Hero image: app + web mockups",src:"images/firsthomecoach.webp"},
{type:"split",label:"overview.",lead:"FirstHomeCoach is a mobile and web app, aimed at helping first-time buyers in the UK to navigate their journey to home ownership - with useful tools & calculators, home-buyer checklist, services marketplace and knowledge library.",text:["I have been working with the FirstHomeCoach brand for over 18 months, with my role spanning multiple areas, including UI design for app and website, and design of content / brand assets for marketing and social media."]},
{type:"trio",label:"challenge, solution, result.",items:[
{h:"Challenge",t:"First time buyers have a harder time than ever getting on the ladder"},
{h:"Solution",todo:true,t:"Add your summary here. The Behance draft still reads: ‘First Home coach offers personalised guidance etc etc etc...’"},
{h:"Result",t:"With FirstHomeCoach, people looking to get on the ladder have a cheaper, easier, and smoother road to ownership."}]},
{type:"cards",label:"App & website UI.",items:[
{t:"Dashboard",d:"Explore the Dashboard for a quick overview of your progress towards your goal, next steps and latest home buying insight."},
{t:"Content feed",d:"Personalised content carousel"},
{t:"Smarter savings",d:"Searching for a home, Legal, surveys, & insurance, Credit building, Other buying schemes, Making the move, Finding a mortgage, Run up to exchange"},
{t:"Tour screens",d:"Tour screens"},
{t:"In-app story content",d:"In-app story content"}]},
{type:"gallery",cols:2,label:"Marketing & social media.",lead:"Design of content / brand assets for marketing and social media.",items:[
{slot:"Instagram posts",cap:"Instagram posts"},
{slot:"Email newsletter",cap:"Email newsletter"},
{slot:"Twitter banner",cap:"Twitter banner"},
{slot:"#FHCPulse",cap:"#FHCPulse, Pulse survey #1: ‘What additional Home Buying Help do you need?’ Key insight: Over 55% of people want more help on Help to Buy"}]},
{type:"image",n:2,slot:"Print media",caption:"Print media"},
{type:"close",text:"Thanks for reading, check out the free app!"}
 ]},
{slug:"ollyrav-design",order:40,visible:true,title:"ollyrav design",tag:"Branding",cardTag:"Branding",thumb:"images/ollyrav-design.webp",
 meta:[["Client","Self-initiated"],["Role","Brand identity"],["Focus","Logo, typography, social"],["Year","20XX"]],
 behance:"https://www.behance.net/ollyrav",pdf:"",
 blocks:[
 {type:"image",slot:"Hero image",src:"images/ollyrav-design.webp"},
 {type:"split",label:"overview.",lead:"A personal brand for my freelance work: logo, typography and social presence.",text:["Placeholder: add the story behind the brand here."]},
 {type:"gallery",label:"the brand.",lead:"Logo, typography and social presence.",items:[
  {slot:"Logo",cap:"Logo"},{slot:"Typography",cap:"Typography"},{slot:"Social",cap:"Social"}]}
 ]}
];

/* ---------- ROLES (about section accordion) ---------- */
var ROLES=[
{order:10,visible:true,role:"Midweight Designer",org:"Ozone | London, UK",years:"2024-present",desc:"As an integral part of Ozone’s in-house creative team, Studiozone, I craft engaging campaigns that connect audiences with content and drive measurable impact for global brands."},
{order:20,visible:true,role:"Digital Product Designer",org:"Life Moments | London, UK",years:"2021-2023",desc:"Working within the Design, Ethics & Behavioural Science team of a fast-paced fintech startup, delivering UX/UI design across web and mobile products, alongside graphic design for B2B marketing communications."},
{order:30,visible:true,role:"Freelance Graphic Designer",org:"ollyrav design | Remote",years:"2020-2024",desc:"Delivering a wide variety of design solutions spanning web design, logo and brand identity, print collateral, social media content, motion graphics, and video editing."},
{order:40,visible:true,role:"Product Design Intern",org:"Made | Antwerp, BE",years:"2020",desc:"A six month internship at one of Belgium's leading strategic product and digital design agencies."},
{order:50,visible:true,role:"Industrial Design Intern",org:"Mormedi | Madrid, ES",years:"2018",desc:"A six month internship at a global business innovation and strategic design consultancy."}
];

/* ---------- TESTIMONIALS ---------- */
var QUOTES=[
{order:10,visible:true,text:"Olly is an <b>exceptional collaborator</b>, consistently willing to work closely with cross-functional teams to achieve project goals.",name:"Ben Leonard",role:"CEO, Life Moments"},
{order:20,visible:true,text:"Olly would <b>add value to any design team</b> and I recommend him for any endeavour he chooses to pursue.",name:"Leander Feliers",role:"Senior Product Designer, Made"},
{order:30,visible:true,text:"Olly joined the Mormedi team as an intern and made an immediate impact to the team, not only in terms of his <b>excellent attitude and application</b>, but also his capabilities as a designer.",name:"Nick Lendon",role:"Industrial Design Lead (former), Mormedi"}
];
