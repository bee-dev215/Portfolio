// ============================================================
//  SITE CONTENT — GKT LLC, robotics software engineering.
//  Edit this single file to update the public site
//  (company details, services, solutions, process and stack).
// ============================================================

export const company = {
  name: "GKT",
  legalName: "GKT LLC",
  initials: "GKT",
  entity: "Limited liability company",
  discipline: "Robotics software engineering",
  email: "welcome.devs@gmail.com",
  phone: "+1 (480) 271 8467",
  phoneHref: "tel:+14802718467",
  availability: "Booking new projects",
  responseTime: "one business day",
  engagements: "Fixed-scope projects · Retainers · Team extension",
  tagline:
    "GKT engineers the motion, perception and fleet software that turns robots into dependable production systems — proven in simulation, commissioned on your floor and supported for the long run.",
  intro:
    "We take robots from a promising demo to a system that runs every shift. One accountable team covers the software end to end — and stays with it after go-live.",
  about: [
    "GKT is a software company focused on one thing: robotics. We design, build and support the software that lets robots see, plan, move and work together — for manufacturers, logistics operators and equipment makers who need automation that holds up in production, not just in the demo.",
    "We work hardware-agnostic and simulation-first. Every behaviour is modelled and tested in a digital twin before it touches steel, so commissioning is shorter, safer and predictable. When the code reaches your site, our engineers are there with it.",
    "Engagements range from a focused integration or retrofit to a complete autonomy stack. Either way you get clear milestones, agreed acceptance tests and software that is documented, tested and handed over in a state your own team can maintain.",
  ],
};

export type SocialKey = "email" | "phone";

export interface SocialLink {
  key: SocialKey;
  label: string;
  handle: string;
  href: string;
}

export const socials: SocialLink[] = [
  { key: "email", label: "Email", handle: company.email, href: `mailto:${company.email}` },
  { key: "phone", label: "Phone", handle: company.phone, href: company.phoneHref },
];

// ------------------------------------------------------------
//  Services — the four ways we work with clients
// ------------------------------------------------------------

export type ServiceKey = "build" | "integrate" | "simulate" | "operate";

export interface Service {
  key: ServiceKey;
  title: string;
  desc: string;
  includes: string[];
}

export const services: Service[] = [
  {
    key: "build",
    title: "Custom robotics software",
    desc: "Motion planning, perception and autonomy software engineered for your robot and your process — from a single work cell to a complete product.",
    includes: ["Motion & control", "Perception & AI", "Autonomy & navigation"],
  },
  {
    key: "integrate",
    title: "Integration & retrofit",
    desc: "Connecting robots to the systems around them — PLCs, safety, MES and WMS — and giving existing cells new capability without replacing the hardware.",
    includes: ["PLC & fieldbus", "MES / WMS links", "Legacy cell upgrades"],
  },
  {
    key: "simulate",
    title: "Simulation & digital twins",
    desc: "Physics-accurate models of your robots and cells for layout studies, virtual commissioning and automated testing of every software release.",
    includes: ["Virtual commissioning", "Scenario testing in CI", "Synthetic data"],
  },
  {
    key: "operate",
    title: "Operations & support",
    desc: "Fleet monitoring, remote operations and maintained software, so the system keeps performing long after go-live.",
    includes: ["Telemetry & alerting", "Over-the-air updates", "Support plans"],
  },
];

// ------------------------------------------------------------
//  Technology stack. Each group shows up to 8 tools.
// ------------------------------------------------------------

export const stackGroups = [
  { title: "Robotics middleware", items: ["ROS 2", "MoveIt 2", "Nav2", "ros2_control", "micro-ROS", "DDS"] },
  { title: "Languages", items: ["Modern C++", "Python", "Rust", "TypeScript", "CUDA"] },
  { title: "Perception & AI", items: ["OpenCV", "PCL", "PyTorch", "TensorRT", "ONNX Runtime", "Open3D"] },
  { title: "Simulation", items: ["NVIDIA Isaac Sim", "Gazebo", "MuJoCo", "URDF / SDF", "Synthetic data"] },
  { title: "Industrial I/O", items: ["OPC UA", "EtherCAT", "PROFINET", "Modbus TCP", "CANopen", "MQTT", "VDA 5050"] },
  { title: "Cloud & DevOps", items: ["Docker", "Kubernetes", "AWS IoT", "Grafana", "CI/CD", "OTA updates"] },
];

// Capabilities scrolling along the bottom of the hero
export const ticker = [
  "Motion planning",
  "Computer vision",
  "Fleet orchestration",
  "Digital twins",
  "ROS 2",
  "Virtual commissioning",
  "Sensor fusion",
  "Edge AI",
  "PLC integration",
  "Teleoperation",
  "Path planning",
  "Safety systems",
];

// ------------------------------------------------------------
//  Solutions — packaged starting points we adapt per client.
//  Images live in public/images/ (16:10).
// ------------------------------------------------------------

export interface Solution {
  id: number;
  title: string;
  category: string; // industry, used by the filter
  domain: string;
  summary: string;
  description: string;
  capabilities: string[];
  tech: string[];
  deliverables: string[];
  image: string;
}

export const solutions: Solution[] = [
  {
    id: 1,
    title: "Cell Control",
    category: "Manufacturing",
    domain: "Manipulation · Motion planning",
    summary:
      "Control software for robotic work cells — pick-and-place, machine tending and palletising — planned collision-free and tuned for cycle time.",
    description:
      "Cell Control is our software stack for industrial and collaborative arms. It plans collision-free trajectories around fixtures and people, picks parts with vision-guided grasping, and talks to your PLC and safety system over standard industrial protocols. We model the cell in simulation first, tune motions for cycle time there, then commission on the real hardware with the same code.",
    capabilities: [
      "Collision-aware motion planning with MoveIt 2 and trajectory optimisation",
      "Vision-guided grasping for mixed, randomly placed parts",
      "PLC and safety handshakes over OPC UA, PROFINET or EtherCAT",
      "Brand-agnostic drivers for industrial and collaborative arms",
    ],
    tech: ["ROS 2", "MoveIt 2", "C++", "ros2_control", "OPC UA", "OpenCV"],
    deliverables: ["Cell software (ROS 2 workspace)", "Simulation model of the cell", "PLC interface specification", "Operator runbook"],
    image: "/images/cell-control.webp",
  },
  {
    id: 2,
    title: "Fleet Orchestrator",
    category: "Logistics",
    domain: "Multi-robot autonomy",
    summary:
      "Traffic control and task allocation for fleets of autonomous mobile robots, so every robot is working — not waiting in an aisle.",
    description:
      "Fleet Orchestrator coordinates autonomous mobile robots across a warehouse or plant. It assigns missions from your WMS or MES, plans deadlock-free routes through shared aisles and lifts, manages charging, and hands work between robots from different vendors. Operators see the whole fleet live and can re-route, pause or take over any robot.",
    capabilities: [
      "Mission allocation driven by your WMS, MES or ERP",
      "Deadlock-free traffic management for shared aisles and lifts",
      "Opportunity charging and battery-aware scheduling",
      "Mixed-vendor fleets through the VDA 5050 interface",
    ],
    tech: ["ROS 2", "Nav2", "Rust", "VDA 5050", "MQTT", "PostgreSQL"],
    deliverables: ["Fleet manager service", "Facility map and traffic rules", "WMS / MES integration", "Live fleet dashboard"],
    image: "/images/fleet-orchestrator.webp",
  },
  {
    id: 3,
    title: "Vision Inspection",
    category: "Manufacturing",
    domain: "Perception · Quality",
    summary: "Machine-vision inspection that finds defects at line speed and records the reason for every reject.",
    description:
      "Vision Inspection puts trained models on the production line. Cameras and lighting are specified for your part, models are trained on your own good and defective samples, and inference runs on edge hardware next to the conveyor. Every decision is logged with its image and confidence, so quality engineers can audit rejects and retrain as products change.",
    capabilities: [
      "Defect detection, measurement and presence checks at line speed",
      "Edge inference on GPU hardware beside the line",
      "Reject logging with images and confidence for audits",
      "Retraining workflow for new variants and products",
    ],
    tech: ["Python", "PyTorch", "TensorRT", "OpenCV", "ONNX Runtime", "C++"],
    deliverables: ["Camera and lighting specification", "Trained inspection models", "Edge inference service", "Quality dashboard and reports"],
    image: "/images/vision-inspection.webp",
  },
  {
    id: 4,
    title: "Digital Twin",
    category: "Manufacturing",
    domain: "Simulation · Virtual commissioning",
    summary: "A physics-accurate model of your robots and cell, used to design, test and commission before the hardware arrives.",
    description:
      "We build a digital twin of the robots, conveyors and fixtures in your cell and connect it to the real control software. Layouts and cycle times are proven in simulation, every software change runs through automated scenarios in CI, and synthetic images train perception models before a camera is installed. Commissioning on site becomes confirmation, not discovery.",
    capabilities: [
      "Virtual commissioning against the real PLC and robot code",
      "Automated regression scenarios in CI for every release",
      "Layout and cycle-time studies before you buy hardware",
      "Synthetic data generation for perception training",
    ],
    tech: ["Isaac Sim", "Gazebo", "MuJoCo", "URDF / SDF", "Python", "Docker"],
    deliverables: ["Simulation model of the cell", "Scenario test suite in CI", "Layout and cycle-time report", "Synthetic datasets"],
    image: "/images/digital-twin.webp",
  },
  {
    id: 5,
    title: "Field Autonomy",
    category: "Field robotics",
    domain: "Outdoor navigation · Localisation",
    summary: "Navigation and localisation for robots that work outdoors — in fields, yards, solar farms and on inspection routes.",
    description:
      "Field Autonomy takes robots beyond the structured factory floor. We fuse RTK-GNSS, lidar, IMU and wheel odometry for centimetre-level positioning, plan coverage paths across rows and uneven ground, and keep the robot safe around people, animals and equipment. Missions are planned on a map and monitored remotely, and the robot pauses and asks for help when it is unsure.",
    capabilities: [
      "Sensor fusion of RTK-GNSS, lidar, IMU and odometry",
      "Coverage and row-following path planning",
      "Obstacle detection and safe-stop behaviours",
      "Remote mission planning and monitoring",
    ],
    tech: ["ROS 2", "Nav2", "C++", "robot_localization", "PCL", "MQTT"],
    deliverables: ["Navigation and localisation stack", "Field test plan and reports", "Mission planning tool", "Safety case inputs"],
    image: "/images/field-autonomy.webp",
  },
  {
    id: 6,
    title: "Robot Ops Console",
    category: "Logistics",
    domain: "Telemetry · Remote operations",
    summary: "One console to monitor, teleoperate and update every robot you run, from any site.",
    description:
      "Robot Ops Console is the operations layer on top of your robots. Telemetry streams from each machine to a central dashboard with alerts and history, operators take remote control with live video when a robot gets stuck, and software updates roll out over the air in staged waves with automatic rollback. It works with robots we build and with the fleets you already run.",
    capabilities: [
      "Live telemetry, alerts and history for every robot",
      "Low-latency teleoperation with live video",
      "Staged over-the-air updates with automatic rollback",
      "Role-based access for operators, engineers and partners",
    ],
    tech: ["TypeScript", "React", "WebRTC", "Kubernetes", "Grafana", "AWS IoT"],
    deliverables: ["Operations console", "Telemetry pipeline", "OTA update service", "Alerting and on-call setup"],
    image: "/images/ops-console.webp",
  },
];

// ------------------------------------------------------------
//  Industries — where the software runs. Images live in public/images/ (portrait crops).
// ------------------------------------------------------------

export interface Industry {
  key: string;
  title: string;
  focus: string;
  desc: string;
  work: string[];
  solutions: string[]; // solution titles; each opens that solution's details
  image: string;
  imageAlt: string;
}

export const industries: Industry[] = [
  {
    key: "manufacturing",
    title: "Manufacturing",
    focus: "Work cells · Assembly · Machine tending",
    desc: "Robot cells that hold cycle time and work with the PLC, safety system and MES around them.",
    work: ["Pick-and-place & palletising", "Machine tending", "Vision-guided assembly"],
    solutions: ["Cell Control", "Vision Inspection", "Digital Twin"],
    image: "/images/ind-manufacturing.webp",
    imageAlt: "Robot arms welding car bodies on an automotive assembly line",
  },
  {
    key: "logistics",
    title: "Logistics & warehousing",
    focus: "AMR fleets · Picking · Intralogistics",
    desc: "Mobile robots coordinated with your WMS, so goods keep moving through shared aisles and lifts.",
    work: ["AMR & AGV fleets", "Robotic picking", "Mixed-vendor traffic"],
    solutions: ["Fleet Orchestrator", "Robot Ops Console"],
    image: "/images/ind-logistics.webp",
    imageAlt: "A wheeled service robot in a warehouse",
  },
  {
    key: "agriculture",
    title: "Agriculture & field",
    focus: "Outdoor autonomy · Coverage · Localisation",
    desc: "Navigation for robots working outdoors — on uneven ground, in changing light and around people and animals.",
    work: ["RTK-GNSS & lidar fusion", "Row-following & coverage", "Remote mission monitoring"],
    solutions: ["Field Autonomy"],
    image: "/images/ind-agriculture.webp",
    imageAlt: "A drone spraying crops in a field",
  },
  {
    key: "energy",
    title: "Energy & infrastructure",
    focus: "Inspection · Teleoperation · Monitoring",
    desc: "Robots that run inspection rounds in plants, substations and solar farms, and report back what they find.",
    work: ["Autonomous inspection rounds", "Remote teleoperation", "Anomaly detection"],
    solutions: ["Field Autonomy", "Vision Inspection", "Robot Ops Console"],
    image: "/images/ind-energy.webp",
    imageAlt: "Rows of four-legged inspection robots",
  },
];

// ------------------------------------------------------------
//  Delivery process. Activities use "Label: detail" so the UI can emphasise the label.
// ------------------------------------------------------------

export interface Phase {
  id: number;
  name: string;
  title: string;
  summary: string;
  activities: string[];
  outputs: string[];
}

export const phases: Phase[] = [
  {
    id: 1,
    name: "Discover",
    title: "Feasibility & requirements",
    summary: "We start on your floor, not in a slide deck: what the robot must do, how fast, how safely, and with which hardware.",
    activities: [
      "Site survey: We walk the process with your operators and engineers and record cycle times, constraints and edge cases.",
      "Requirements: Tasks, throughput targets, safety requirements and integration points captured in one shared specification.",
      "Feasibility: A short technical spike on the hardest part — the grasp, the sensor, the aisle — before anyone commits budget.",
      "Proposal: A fixed-scope plan with milestones, acceptance criteria and a list of known risks.",
    ],
    outputs: ["Requirements spec", "Feasibility report", "Fixed-scope proposal"],
  },
  {
    id: 2,
    name: "Simulate",
    title: "Digital twin & proof of concept",
    summary: "The cell is modelled to scale and the core behaviour runs end to end in simulation, so you see it work before hardware is ordered.",
    activities: [
      "Cell model: Robots, fixtures, conveyors and people modelled with real kinematics and physics.",
      "Proof of concept: The hardest behaviour running end to end against the simulated cell.",
      "Layout & cycle time: Layout options compared and cycle times measured, not estimated.",
    ],
    outputs: ["Simulation model", "Proof-of-concept demo", "Layout study"],
  },
  {
    id: 3,
    name: "Build",
    title: "Production software engineering",
    summary: "Motion, perception and fleet software engineered in short iterations, with a working demo at every milestone.",
    activities: [
      "Architecture: A modular ROS 2 architecture with clear interfaces to your PLC, MES and safety systems.",
      "Engineering: Features delivered in short iterations and reviewed against the simulated cell.",
      "Testing: Unit, integration and simulation scenario tests run automatically on every change.",
    ],
    outputs: ["Source code", "CI pipeline", "Test reports"],
  },
  {
    id: 4,
    name: "Integrate",
    title: "On-site commissioning",
    summary: "Our engineers install the software on your hardware and prove it against the acceptance tests agreed at the start.",
    activities: [
      "Installation: Software deployed and connected on site, alongside your integrator or maintenance team.",
      "Acceptance: Agreed tests run on the real cell — throughput, accuracy and safety behaviours.",
      "Handover: Operator training, runbooks and documentation for your team.",
    ],
    outputs: ["Commissioned system", "Acceptance report", "Training & runbooks"],
  },
  {
    id: 5,
    name: "Operate",
    title: "Monitoring, updates & support",
    summary: "Go-live is the start of the job. We monitor, improve and support the system for as long as it runs.",
    activities: [
      "Monitoring: Telemetry and alerting so issues are caught before they stop production.",
      "Updates: Improvements and fixes delivered as tested, staged releases.",
      "Support: Support plans sized to your shifts, from engineers who know your system.",
    ],
    outputs: ["Support plan", "Release notes", "Health reports"],
  },
];

// ------------------------------------------------------------
//  Company
// ------------------------------------------------------------

export const principles = [
  {
    title: "Safety by design",
    desc: "We design around the applicable safety standards from the first sketch, working with your safety engineers and integrators — never bolted on at sign-off.",
  },
  {
    title: "Simulation first",
    desc: "Every behaviour is proven in a digital twin before it runs on hardware. Fewer surprises on site, shorter commissioning, safer testing.",
  },
  {
    title: "Hardware agnostic",
    desc: "We choose robots, sensors and compute on merit and build on open standards like ROS 2, so you are never locked in to one vendor — including us.",
  },
  {
    title: "Measured in uptime",
    desc: "A demo is not a deployment. We judge our work by throughput and availability on real shifts, and stay involved to keep it there.",
  },
];

// Frequently asked questions (shown above the contact form)
export const faqs = [
  {
    q: "Do you sell robots or other hardware?",
    a: "No — GKT is a software company. We help you choose robots, sensors and compute on merit, build on the hardware you already own, and work alongside your integrator for the mechanical and electrical side.",
  },
  {
    q: "Which robots and platforms do you work with?",
    a: "We are hardware-agnostic: industrial and collaborative arms, autonomous mobile robots and outdoor platforms. Our software is built on ROS 2 and open industrial interfaces such as OPC UA, EtherCAT and VDA 5050, so it connects through open standards rather than one vendor's ecosystem.",
  },
  {
    q: "How are projects priced?",
    a: "Most work starts with a short discovery phase, followed by a fixed-scope proposal with milestones and acceptance criteria agreed up front. Ongoing improvements and support run on a retainer, and we can also extend your own engineering team.",
  },
  {
    q: "Why do you simulate before touching hardware?",
    a: "Hardware time is the scarcest and most expensive part of a robotics project. Proving behaviour in a digital twin first means shorter, safer commissioning and fewer surprises on your floor — and the same scenarios keep testing every later release.",
  },
  {
    q: "Will you work on site with our team?",
    a: "Yes. Our engineers commission the system on site alongside your integrator or maintenance team, then hand over runbooks and training so your own staff can operate and maintain it.",
  },
  {
    q: "What happens after go-live?",
    a: "Go-live is the start of the job. We monitor the system, ship improvements as tested, staged releases and support it under a plan sized to your shifts, for as long as it runs.",
  },
];

// Shown beside the contact form
export const nextSteps = [
  { title: "Engineer review", desc: `An engineer reads your enquiry and replies within ${company.responseTime}.` },
  { title: "Discovery call", desc: "A short call to understand the task, the hardware and your constraints." },
  { title: "Proposal", desc: "A fixed-scope proposal with milestones and acceptance criteria." },
];

export const companyFile = [
  { k: "Legal name", v: company.legalName },
  { k: "Entity", v: company.entity },
  { k: "Discipline", v: company.discipline },
  { k: "Engagements", v: company.engagements },
];

export const stats = [
  { value: String(solutions.length), label: "Solution blueprints ready to adapt" },
  { value: String(phases.length), label: "Delivery phases, discovery to support" },
  { value: String(stackGroups.reduce((n, g) => n + g.items.length, 0)), label: "Tools across the robotics stack" },
  { value: "100%", label: "Releases tested in simulation first" },
];

// ------------------------------------------------------------
//  Photography credits. Freepik's (now Magnific) free licence requires attribution, so every
//  photo used on the site is listed here and shown at /terms#credits.
// ------------------------------------------------------------

export interface ImageCredit {
  file: string;
  subject: string;
  author: string;
  href: string; // the photo's Freepik page
}

export const imageCredits: ImageCredit[] = [
  { file: "cell-control.webp", subject: "Cell Control — robot arms in a smart factory", author: "Freepik", href: "https://www.magnific.com/free-ai-image/robotic-arms-modern-factory-setting_417567669.htm" },
  { file: "fleet-orchestrator.webp", subject: "Fleet Orchestrator — mobile robots in a warehouse", author: "user6702303", href: "https://www.magnific.com/free-photo/robot-arm-picks-up-box-autonomous_18321474.htm" },
  { file: "vision-inspection.webp", subject: "Vision Inspection — robot placing a chip", author: "Freepik", href: "https://www.magnific.com/free-ai-image/robotic-arm-placing-chip-circuit-board_420745227.htm" },
  { file: "digital-twin.webp", subject: "Digital Twin — robot model on a laptop", author: "DC Studio", href: "https://www.magnific.com/free-photo/technician-managing-robotic-arms-conveyor-belts-smart-manufacturing-plant_418613798.htm" },
  { file: "field-autonomy.webp", subject: "Field Autonomy — robot spraying crops", author: "user6702303", href: "https://www.magnific.com/free-photo/robot-spraying-fertilizer-vegetable-garden_65134569.htm" },
  { file: "ops-console.webp", subject: "Robot Ops Console — monitoring workstation", author: "DC Studio", href: "https://www.magnific.com/free-photo/pc-monitoring-photovoltaics-factory-engineering-workspace_416930226.htm" },
  { file: "ind-manufacturing.webp", subject: "Manufacturing — automotive assembly line", author: "usertrmk", href: "https://www.magnific.com/free-photo/car-bodies-are-assembly-line-factory-production-cars-modern-automotive-industry-electric-car-factory-conveyor_26151287.htm" },
  { file: "ind-logistics.webp", subject: "Logistics — robot in a warehouse", author: "Freepik", href: "https://www.magnific.com/free-ai-image/delivery-robot-futuristic-environment_138544800.htm" },
  { file: "ind-agriculture.webp", subject: "Agriculture — drone spraying a field", author: "user6702303", href: "https://www.magnific.com/free-photo/drone-spraying-fertilizer-vegetable-green-plants-agriculture-technology-farm-automation_36681035.htm" },
  { file: "ind-energy.webp", subject: "Energy — quadruped robots", author: "user6702303", href: "https://www.magnific.com/free-photo/robot-dog-is-robot-factory_25514951.htm" },
  { file: "company-lab.webp", subject: "Company — engineers building a robot", author: "frimufilms", href: "https://www.magnific.com/free-photo/young-man-woman-protective-glasses-doing-experiments-robotics-laboratory-robot_59151288.htm" },
  { file: "cta-backdrop.webp", subject: "Solutions banner — robotic arm", author: "vecstock", href: "https://www.magnific.com/free-ai-image/futuristic-robotic-arm-controls-automated-steel-production-generated-by-ai_42597138.htm" },
];

// Suggested categories offered in the admin project form (you can type any category)
export const suggestedCategories = ["Manufacturing", "Logistics", "Field robotics", "Healthcare", "Energy", "Agriculture"];

export const navLinks = [
  { id: "services", label: "Services" },
  { id: "industries", label: "Industries" },
  { id: "solutions", label: "Solutions" },
  { id: "process", label: "Process" },
  { id: "company", label: "Company" },
  { id: "contact", label: "Contact" },
];

// Footer site map (every section, including the ones not in the top bar)
export const footerLinks = [
  { id: "services", label: "Services" },
  { id: "industries", label: "Industries" },
  { id: "solutions", label: "Solutions" },
  { id: "process", label: "Process" },
  { id: "technology", label: "Technology" },
  { id: "company", label: "Company" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

export const legalLinks = [
  { to: "/privacy", label: "Privacy policy" },
  { to: "/terms", label: "Terms of use" },
];

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/** Fired on window to open a solution's details; detail is the solution title. */
export const OPEN_SOLUTION_EVENT = "gkt:open-solution";

/** Opens one solution's details in place (the modal overlays wherever the reader is). */
export const openSolution = (title: string) => {
  window.dispatchEvent(new CustomEvent<string>(OPEN_SOLUTION_EVENT, { detail: title }));
};

/** Fired on window to pre-fill the contact form; detail is the solution of interest, if any. */
export const ENQUIRE_EVENT = "gkt:enquire";

/** Scrolls to the contact form, optionally pre-filling it for a specific solution. */
export const startEnquiry = (topic?: string) => {
  window.dispatchEvent(new CustomEvent<string | undefined>(ENQUIRE_EVENT, { detail: topic }));
  scrollToId("contact");
};
