/* ==========================================================================
   CONTENT
   --------------------------------------------------------------------------
   Everything on the site that is words lives in this one file. Change the text
   between the quotes and reload the page — nothing else needs touching.

   Rules of thumb:
     · Keep the quotes, the commas and the square/curly brackets where they are.
     · Basic HTML is allowed inside any string:  <b>bold</b>  <br>  <a href="">
     · An apostrophe inside a "double quoted" string is fine. If you need a
       double quote inside one, write it as \"like this\".
     · A list written as [ "one", "two" ] renders one paragraph per entry.
   ========================================================================== */

window.CONTENT = {

  /* ---------- page + browser tab ---------- */
  site: {
    title:       "Eric Johnson",
    description: "CS Undergrad. HPC, Automation, Sysadmin, and side-channel machine learning research.",
    footerLeft:  "© 2026 Eric Johnson",
    footerRight: "",
    footerNote:  ""                    /* right-hand footer note; leave "" for none */
  },

  /* ---------- the two links in the top-right corner ---------- */
  links: {
    github:   "https://github.com/ericnmt",
    linkedin: "https://linkedin.com/in/ericjohnson07"
  },

  /* ---------- the drop-down menu behind the logo ----------
     id must match the section id in index.html.
     ratio sets the Lissajous figure the mark eases to while that section is on
     screen — two small whole numbers. It is not shown as text anywhere. */
  menu: [
    { id: "hero",     label: "Intro",                            ratio: [3, 2] },
    { id: "skills",   label: "My Skills",                        ratio: [4, 3] },
    { id: "resume",   label: "Resume",                           ratio: [5, 3] },
    { id: "research", label: "Hardware Trojan Research",         ratio: [5, 4] },
    { id: "hpc",      label: "High-Performance Computing Intern", ratio: [7, 5] },
    { id: "it",       label: "IT Systems Automation Intern",     ratio: [9, 7] },
    { id: "projects", label: "Additional Projects",              ratio: [11, 8] }
  ],

  /* ---------- 1. opening ---------- */
  hero: {
    eyebrow: "Intel Undergraduate Research Fellowship",
    badge:   "· AVAILABLE SUMMER 2027",
    name:    "Eric Johnson",
    role: [
      "<b>B.S. in Computer Science undergraduate</b> · Data Science minor · <b>New Mexico Institute of Mining & Technology</b>"
      /* "Class of <b>2028</b>" */
    ],
    bio: "Three years at <b>Los Alamos National Laboratory</b> across High-Performance Computing (HPC), systems administration, and infrastructure automation, plus applied research experience in Machine Learning at <b>New Mexico Institute of Mining & Technology</b> as part of the <b>Intel Undergraduate Research Program</b>. <span>I have experience in cluster provisioning, automation in the environments they live in, and most recently am looking into hardware Trojans using side-channel signal traces with Deep Learning algorithms. </span>I am seeking a summer 2027 undergraduate internship in Artificial Intelligence, Machine Learning, or High-Performance Computing."
  },

  /* ---------- 2. keyword space ---------- */
  skills: {
    eyebrow: "My Skills",
    heading: "What I work with",
    slotHint: "Click a keyword to jump to the section where it is most closely demonstrated.",
    sublede: "My experience spans both</span> High-Performance Computing / Systems Administration and Machine Learning Research. Everything below are the skills that I have developed so far as a result.</span>",

    /* Each entry is [ "the words on the pill", "which cluster" ] and, optionally,
       a third value naming a section id to jump to instead of the cluster's own
       section — used here to send a few keywords straight to "projects" since
       that's where they're actually demonstrated.
       The cluster must be one of: "hpc", "it", "research".
       Add or remove lines freely — the layout re-solves itself. */
    keywords: [
      ["MPI", "hpc"], ["HPL", "hpc"], ["Slurm", "hpc"], ["OpenCHAMI", "hpc"],
      ["parallel benchmarking", "hpc"], ["containers", "hpc"], ["hypervisors", "hpc"],
      ["Rocky Linux", "hpc"], ["Podman", "hpc"], ["Bash", "hpc"], ["systemd-nspawn", "hpc"],

      ["Ansible", "it"], ["GitLab CI/CD", "it"], ["Red Hat Satellite", "it"],
      ["Hyper-V", "it"], ["PowerShell", "it"], ["Java", "it", "projects"],
      ["Docker", "it"], ["RHEL", "it"], ["documentation", "it"], ["SQL", "it", "projects"],

      ["PyOD", "research"], ["PyTorch", "research"], ["anomaly detection", "research"],
      /*["side-channel", "research"], */["CNNs", "research", "projects"], ["Hugging Face", "research"],
      ["Keras / TF", "research"], ["Python", "research"], ["R", "research"]
    ]
  },

  /* ---------- 3. resume ----------
     To show a real PDF: put the file in  assets/pdf/  and set
       file: "assets/pdf/resume.pdf"
     Leave file as "" and the section shows an empty viewer slot instead.
     ratio: [w,h] is the PDF's own page proportions — a US Letter page is
     [17,22], A4 is roughly [17,24]. Getting this right is what keeps the
     embed from being cropped or padded with dead space; if you swap in a
     PDF with a different page size, update this to match. */
  resume: {
    eyebrow:   "Resume",
    filename:  "johnson-eric-resume.pdf",
    file:      "assets/pdf/Johnson_Eric.pdf",
    ratio:     [17, 22],
    slotTitle: "Resume",
    slotHint:  ""
  },

  /* ---------- 3. HPC internship ---------- */
  hpc: {
    eyebrow: "Los Alamos National Laboratory (LANL)",
    meta:    "Supercomputer Institute · May – August 2026",
    heading: "High-Performance Computing Intern",
    sublede: "At the Supercomputer Institute, I worked with a peer team to develop a novel boot method for HPC node reprovisioning, bringing together containers and virtual machines to enable rapid node image swapping. We benchmarked our method using MPI AllReduce and HPL against traditional methods, and presented our findings at <a href=\"https://www.lanl.gov/engage/organizations/aldsct/hpc/intern-resources/intern-showcase\" target=\"_blank\" rel=\"noopener noreferrer\">LANL's 2026 HPC Intern Showcase</a>. Additionally, I deployed and administered an HPC compute cluster with a peer team, using OpenCHAMI and Slurm for provisioning and job scheduling, leveraging Ansible and CI/CD pipelines for configuration.",

    points: [
      "<b>Virtual switch root.</b> A novel boot technique for HPC node reprovisioning, enabling rapid node image swapping by combining systemd-nspawn containers and QEMU virtual machines. We benchmarked our techniques against traditional methods using MPI AllReduce and High-Performance Linpack (HPL), demonstrating that cloud-like flexibility can be achieved within HPC with minimal performance loss.",
      "<b>Cluster deployment.</b> Over the course of three weeks, I worked with a team to stand up and deploy a compute cluster using OpenCHAMI, cloud-init, Slurm WLM, and Ansible for configuration management. We leveraged CI/CD pipelines to automate the deployment process, ensuring consistency and repeatability across the cluster.",
    ],

    /* Same as the resume slot, including ratio — this poster is a 44x34in
       landscape sheet, [22,17]. The showcase poster already in this repo can
       be wired up by setting:
         file: "rapid-reprovisioning-with-virtual-switch-root-POSTER.pdf" */
    pdf: {
      filename:  "virtual-switch-root.pdf",
      file:      "assets/pdf/rapid-reprovisioning-with-virtual-switch-root-POSTER.pdf",
      ratio:     [22, 17],
      slotTitle: "Showcase poster / slides",
      slotHint:  ""
    }
  },

  /* ---------- 5. IT Systems Automation Intern ---------- */
  it: {
    eyebrow: "Los Alamos National Laboratory (LANL)",
    meta:    "June 2023 – May 2026",
    heading: "IT Systems Automation Intern",
    sublede: "My role was to maintain and automate the Linux and Windows environments, while authoring and continuously updating comprehensive technical documentation for the group. I implemented Ansible Automation Platform and PowerShell workflows to replace manual per-VM configuration and snapshotting with automated, repeatable provisioning and state management. I also stood up and administered Red Hat Satellite and GitLab servers, enabling centralized Linux package distribution and source code management.",

    points: [
      "<b>Centralization.</b> Stood up and administered Red Hat Satellite and GitLab servers, centralizing Linux package distribution and source code management.",
      "<b>Automated workflows.</b> Designed and implemented Ansible Automation Platform and PowerShell workflows for Hyper-V Hypervisor management, replacing manual per-VM configuration with automated, repeatable, modular, workflows for provisioning and state management.",
      "<b>Documentation.</b> Authored and maintained cross-platform documentation across Linux, Windows and Ansible, and provided troubleshooting support — giving new hires self-service references for common workflows and environment setup."
    ]
  },

    /* ---------- 6. hardware Trojan research ---------- */
  research: {
    eyebrow: "Research — Intel Undergraduate Research Fellow",
    meta:    "New Mexico Institute of Mining & Technology · Aug – Dec 2026",
    heading: "Golden-chip-free hardware Trojan detection",
    sublede: "I am currently evaluating anomaly detection models from the Python Outlier Detection (PyOD) library for golden-chip-free hardware Trojan detection on power and electromagnetic side-channel traces. The goal is to benchmark algorithm effectiveness against classical baselines on unlabeled measurement data, flagging anything that falls outside the ordinary.",

    points: [
      "<b>The problem.</b> Hardware Trojan detection is a critical challenge in ensuring the security of integrated circuits. Traditional methods rely on golden chip references, which are impractical to obtain in many scenarios.",
      "<b>The challenge.</b> Side-channel traces are high-dimensional, noisy, and often unlabeled, making it difficult to identify anomalies indicative of hardware Trojans. The lack of a golden reference chip further complicates the detection process.",
      "<b>The approach.</b> Using deep learning and anomaly detection techniques, I am evaluating various models from the PyOD library to identify potential hardware Trojans in side-channel traces. The goal is to develop a robust detection framework that can operate effectively without the need for golden chip references."
    ]
  },

  /* ---------- 7. additional projects ----------
     A plain list — no canvas, no animation. Each entry is one card:
       title:       shows as the card heading
       description: a sentence or two (basic HTML is fine)
       url:         where the card links; leave "" (or omit it) for a card
                    with no link — it renders as plain text instead of a link
       tag:         optional small label on the right of the title
                    (a year, a stack, "in progress" — leave "" for none)
     Add or remove entries freely; the grid re-flows on its own. */
  projects: {
    eyebrow: "Additional Projects",
    heading: "A few smaller things",
    sublede: "",

    items: [
      // {
      //   title:       "Project name",
      //   description: "One or two sentences on what it is and why it exists.",
      //   url:         "https://github.com/ericnmt/project-name",
      //   tag:         "2026"
      // },
       {
         title:       "Object Oriented Programming Clinic Scheduler",
         description: "A Java program that simulates a clinic scheduler command-line interface. It uses object-oriented programming principles to manage patients, appointments, and clinic faculty schedules. The program allows users to add, remove, and view appointments, while ensuring that business logic constraints are met. It also includes error handling and input validation to provide a robust user experience.",
         url:         "https://github.com/ericnmt/oop-clinic-scheduler",
         tag:         "OOP"
       },
       {
         title:       "Binary Classification with fastai",
         description: "A simple demonstration using fastai's library to perform binary classification on a dataset consisting of cat and dog images. The project showcases the use of pre-trained convolutional neural networks (CNNs) for image classification tasks, leveraging transfer learning to achieve accurate results with a relatively small dataset. The notebook includes data preprocessing, model training, and evaluation steps, providing an example of using the fastai framework for practical machine learning applications.",
         url:         "https://github.com/ericnmt/fastai-cat-demo",
         tag:         "CNNs"
       },
    ]
  }
};
