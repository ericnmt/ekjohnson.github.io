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
    description: "Computer science undergraduate. High-performance computing, infrastructure automation, and side-channel machine learning research.",
    footerLeft:  "Eric Johnson",
    footerRight: "New Mexico Tech",
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
    { id: "it",       label: "IT Systems Engineering",     ratio: [7, 5] },
    { id: "research", label: "Hardware Trojan research",   ratio: [9, 7] }
  ],

  /* ---------- 1. opening ---------- */
  hero: {
    eyebrow: "Computer science undergraduate",
    badge:   "Available summer 2027",
    name:    "Eric Johnson",
    role: [
      "<b>CS undergrad</b> · Data Science minor",
      "New Mexico Tech · <b>3.8 GPA</b>",
      "Class of <b>2028</b>"
    ],
    bio: "Three years at <b>Los Alamos National Laboratory</b> across HPC and infrastructure engineering, plus applied research in machine learning. <span>I provision clusters, automate the environments they live in, and — most recently — look for hardware Trojans in side-channel traces. Seeking a summer 2027 undergraduate internship with CAI in applied computer science.</span>"
  },

  /* ---------- 2. keyword space ---------- */
  skills: {
    eyebrow: "Keyword space",
    heading: "What I actually work with",
    sublede: "Everything below is drawn from the resume, grouped by the work it belongs to \u2014 the clusters are the three roles.",

    /* Each entry is [ "the words on the pill", "which cluster" ].
       The cluster must be one of: "hpc", "it", "research".
       Add or remove lines freely — the layout re-solves itself. */
    keywords: [
      ["MPI", "hpc"], ["HPL", "hpc"], ["Slurm", "hpc"], ["OpenCHAMI", "hpc"],
      ["parallel benchmarking", "hpc"], ["containers", "hpc"], ["hypervisors", "hpc"],
      ["Rocky Linux", "hpc"], ["Podman", "hpc"], ["node reprovisioning", "hpc"],
      ["Bash", "hpc"],

      ["Ansible", "it"], ["GitLab CI/CD", "it"], ["Red Hat Satellite", "it"],
      ["Hyper-V", "it"], ["PowerShell", "it"], ["systemd-nspawn", "it"],
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
    filename:  "resume.pdf",
    file:      "",
    slotTitle: "Resume",
    slotHint:  ""
  },

  /* ---------- 4. HPC internship ---------- */
  hpc: {
    eyebrow: "Experience — LANL",
    meta:    "Supercomputer Institute · May 2026 – present",
    heading: "High-Performance Computing Intern",
    sublede: "Deployed and administered an HPC compute cluster with a peer team, and developed a boot method that swaps a node\u2019s root image and brings it back without a full reprovision cycle.",

    points: [
      "<b>Novel boot method.</b> Developed and presented a boot method leveraging containers and hypervisors to enable rapid node reprovisioning, benchmarked using MPI and HPL against traditional methods. Presented findings at LANL's 2026 HPC Intern Showcase.",
      "<b>Cluster deployment.</b> Deployed and administered an HPC compute cluster with a peer team, using OpenCHAMI and Slurm for provisioning and job scheduling, leveraging Ansible and CI/CD pipelines for configuration."
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

  /* ---------- 5. IT systems engineering ---------- */
  it: {
    eyebrow: "Experience — LANL",
    meta:    "Sensitive &amp; Special Operations · June 2023 – May 2026",
    heading: "IT Systems Engineering Intern",
    sublede: "Three years turning per-machine handwork into declared state.",

    points: [
      "<b>Centralised the environment.</b> Stood up and administered Red Hat Satellite and GitLab servers, enabling centralized Linux package distribution and source code management across the group's IT development environment.",
      "<b>Replaced per-VM handwork.</b> Designed and implemented Ansible Automation Platform and PowerShell workflows for Hyper-V hypervisors, replacing manual per-VM configuration with automated, repeatable provisioning and state management.",
      "<b>Documented it.</b> Authored and maintained cross-platform documentation across Linux, Windows and Ansible, and provided troubleshooting support — giving new hires self-service references for common workflows and environment setup."
    ]
  },

  /* ---------- 6. hardware Trojan research ---------- */
  research: {
    eyebrow: "Research — Intel Undergraduate Research Fellow",
    meta:    "NM Tech · Aug – Dec 2026",
    heading: "Golden-chip-free hardware Trojan detection",
    sublede: "Finding a Trojan in a chip you have no clean copy of, using only what the power draw gives away.",

    points: [
      "<b>The problem.</b> Evaluating anomaly detection models from the Python Outlier Detection (PyOD) library for golden-chip-free hardware Trojan detection on power and electromagnetic side-channel traces from AES Trojan variants (Trust Hub / IEEE DataPort).",
      "<b>Why it\u2019s hard.</b> Benchmarking detector effectiveness against classical baselines on unlabeled, imbalanced measurement data, where dormant Trojans separate from baseline circuits only by dynamic power draw.",
      "<b>The approach.</b> Reduce each measurement to a handful of numbers, learn where the ordinary ones sit, and rank whatever falls outside that. No labels, and no golden reference chip to compare against."
    ]
  }
};
