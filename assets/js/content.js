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
    footerLeft:  "© 2026Eric Johnson",
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
    { id: "hero",     label: "Intro",                      ratio: [3, 2] },
    { id: "skills",   label: "Keyword space",              ratio: [4, 3] },
    { id: "resume",   label: "Resume",                     ratio: [5, 3] },
    { id: "hpc",      label: "High-Performance Computing", ratio: [5, 4] },
    { id: "it",       label: "IT Systems Automation Intern",     ratio: [7, 5] },
    { id: "research", label: "Hardware Trojan research",   ratio: [9, 7] }
  ],

  /* ---------- 1. opening ---------- */
  hero: {
    eyebrow: "Intel Undergraduate Research Fellowship",
    badge:   "Available summer 2027",
    name:    "Eric Johnson",
    role: [
      "<b>B.S. in Computer Science undergraduate</b> · Data Science minor",
      "New Mexico Institute of Mining & Technology"
      /* "Class of <b>2028</b>" */
    ],
    bio: "Three years at <b>Los Alamos National Laboratory</b> across High-Performance Computing (HPC), systems administration, and infrastructure automation, plus applied research experience in Machine Learning at <b>New Mexico Institute of Mining & Technology</b> as part of the <b>Intel Undergraduate Research Program</b>. <span>I have experience in cluster provisioning, automation in the environments they live in, and most recently am looking into hardware Trojans using side-channel signal traces with Deep Learning algorithms. </span>I am seeking a summer 2027 undergraduate internship in Artificial Intelligence, Machine Learning, or High-Performance Computing."
  },

  /* ---------- 2. keyword space ---------- */
  skills: {
    eyebrow: "My Skills",
    heading: "What I actually work with",
    sublede: "My experience spans both</span> High-Performance Computing / Systems Administration and Machine Learning Research. Everything below are the skills that I have developed so far as a result.</span>",

    /* Each entry is [ "the words on the pill", "which cluster" ].
       The cluster must be one of: "hpc", "it", "research".
       Add or remove lines freely — the layout re-solves itself. */
    keywords: [
      ["MPI", "hpc"], ["HPL", "hpc"], ["Slurm", "hpc"], ["OpenCHAMI", "hpc"],
      ["parallel benchmarking", "hpc"], ["containers", "hpc"], ["hypervisors", "hpc"],
      ["Rocky Linux", "hpc"], ["Podman", "hpc"], ["Bash", "hpc"], ["systemd-nspawn", "hpc"],

      ["Ansible", "it"], ["GitLab CI/CD", "it"], ["Red Hat Satellite", "it"],
      ["Hyper-V", "it"], ["PowerShell", "it"],
      ["Docker", "it"], ["RHEL", "it"], ["documentation", "it"], ["SQL", "it"],

      ["PyOD", "research"], ["PyTorch", "research"], ["anomaly detection", "research"],
      ["side-channel", "research"], ["CNNs", "research"], ["Hugging Face", "research"],
      ["Keras / TF", "research"], ["Python", "research"], ["R", "research"]
    ]
  },

  /* ---------- 3. resume ----------
     To show a real PDF: put the file in  assets/pdf/  and set
       file: "assets/pdf/resume.pdf"
     Leave file as "" and the section shows an empty viewer slot instead. */
  resume: {
    eyebrow:   "Resume",
    filename:  "Johnson_Eric.pdf",
    file:      "",
    slotTitle: "Resume",
    slotHint:  ""
  },

    /* ---------- 4. hardware Trojan research ---------- */
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

  /* ---------- 3. HPC internship ---------- */
  hpc: {
    eyebrow: "Los Alamos National Laboratory (LANL)",
    meta:    "Supercomputer Institute · May – August 2026",
    heading: "High-Performance Computing Intern",
    sublede: "At the Supercomputer Institute, I worked with a peer team to develop a novel boot method for HPC node reprovisioning, bringing together containers and virtual machines to enable rapid node image swapping. We benchmarked our method using MPI AllReduce and HPL against traditional methods, and presented our findings at <a href=\"https://www.lanl.gov/engage/organizations/aldsct/hpc/intern-resources/intern-showcase\" target=\"_blank\" rel=\"noopener noreferrer\">LANL's 2026 HPC Intern Showcase</a>. Additionally, I deployed and administered an HPC compute cluster with a peer team, using OpenCHAMI and Slurm for provisioning and job scheduling, leveraging Ansible and CI/CD pipelines for configuration.",

    points: [
      "<b>Rapid reprovisioning.</b> Presented <b>Virtual Switch Root</b>, a novel boot method for HPC compute node reprovisioning. The key innovation is leveraging a systemd-nspawn container or QEMU VM to boot a node into a minimal environment, where the node can then reprovision itself from a networked boot image. This method enables rapid image swapping on compute nodes, reducing downtime and improving overall cluster efficiency.",
      "<b>Cluster deployment.</b> Over the course of three weeks, I worked with a team to stand up and deploy a compute cluster using OpenCHAMI, cloud-init, Slurm WLM, and Ansible for configuration management. We leveraged CI/CD pipelines to automate the deployment process, ensuring consistency and repeatability across the cluster.",
    ],

    /* Same as the resume slot. The showcase poster already in this repo can be
       wired up by setting:
         file: "rapid-reprovisioning-with-virtual-switch-root-POSTER.pdf" */
    pdf: {
      filename:  "showcase-poster.pdf",
      file:      "",
      slotTitle: "Showcase poster / slides",
      slotHint:  ""
    }
  },

  /* ---------- 5. IT Systems Automation Intern ---------- */
  it: {
    eyebrow: "Los Alamos National Laboratory (LANL)",
    meta:    "June 2023 – May 2026",
    heading: "IT Systems Automation Intern",
    sublede: "My role was to maintain and automate the Linux and Windows environments, while writing comprehensive technical documentation for the group. I implemented Ansible Automation and PowerShell workflows to replace manual per-VM configuration and snapshotting with automated, repeatable provisioning and state management. I also stood up and administered Red Hat Satellite and GitLab servers, enabling centralized Linux package distribution and source code management.",

    points: [
      "<b>Centralization.</b> Stood up and administered Red Hat Satellite and GitLab servers, centralizing Linux package distribution and source code management.",
      "<b>Automated workflows.</b> Designed and implemented Ansible Automation Platform and PowerShell workflows for Hyper-V Hypervisor management, replacing manual per-VM configuration with automated, repeatable, modular, workflows for provisioning and state management.",
      "<b>Documentation.</b> Authored and maintained cross-platform documentation across Linux, Windows and Ansible, and provided troubleshooting support — giving new hires self-service references for common workflows and environment setup."
    ]
  },
};
