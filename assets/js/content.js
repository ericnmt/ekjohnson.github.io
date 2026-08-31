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
    description: "Computer Scince undergraduate. High-Performance Computing, infrastructure automation, and hardware trojan detection machine learning research.",
    footerLeft:  "Eric Johnson",
    footerRight: "2026",
    footerNote:  ""                    /* right-hand footer note; leave "" for none */
  },

  /* ---------- the two links in the top-right corner ---------- */
  links: {
    github:   "https://github.com/ericnmt",
    linkedin: "https://linkedin.com/in/ericjohnson07"
  },

  /* ---------- the drop-down menu behind the logo ----------
     id must match the section id in index.html.
     ratio is the two numbers shown beside the label — it also sets the
     Lissajous figure the logo draws while that section is on screen. */
  menu: [
    { id: "hero",     label: "Intro",                      ratio: [3, 2] },
    { id: "skills",   label: "Keyword space",              ratio: [4, 3] },
    { id: "resume",   label: "Resume",                     ratio: [5, 3] },
    { id: "hpc",      label: "High-Performance Computing", ratio: [5, 4] },
    { id: "it",       label: "IT Systems Automation",     ratio: [7, 5] },
    { id: "research", label: "Hardware Trojan research",   ratio: [9, 7] }
  ],

  /* ---------- 1. opening ---------- */
  hero: {
    eyebrow: "Computer science undergraduate",
    badge:   "Available summer 2027",
    name:    "Eric Johnson",
    role: [
      "<b>B.S. in CS undergrad</b> · Data Science minor",
      "<b>New Mexico Institute of Mining & Technology</b>"
    ],
    bio: "Three years at <b>Los Alamos National Laboratory</b> across HPC and infrastructure engineering, plus applied research experience in machine learning (ML) at <b>New Mexico Tech</b>. <span>I have experience in cluster provisioning, automation in the environments they live in, and most recently am looking into hardware Trojans in side-channel signal traces. </span>I am seeking a summer 2027 undergraduate internship in Artificial Intelligence, Machine Learning, or High-Performance Computing."

  },

  /* ---------- 2. keyword space ---------- */
  skills: {
    eyebrow: "My skills",
    hint:    "drag to rotate · click to jump to relevant project",
    heading: "What I actually work with",
    sublede: "<span>My experience spans both</span> High-Performance Computing / Sytems Administration and Machine Learning Research. <span>Below are the skills that I have deleoped as a result.</span>",
    legendA: "HPC &amp; infrastructure",
    legendB: "Research &amp; ML",
    readout: "",

    /* Each entry is [ "the words on the pill", "which cluster" ].
       The cluster must be one of: "hpc", "it", "research".
       Add or remove lines freely — the layout re-solves itself. */
    keywords: [
      ["MPI", "hpc"], ["HPL", "hpc"], ["Slurm", "hpc"], ["OpenCHAMI", "hpc"],
      ["parallel benchmarking", "hpc"], ["containers", "hpc"], ["hypervisors", "hpc"],
      ["Rocky Linux", "hpc"], ["Podman", "hpc"], ["node reprovisioning", "hpc"], ["systemd-nspawn", "hpc"]

      ["Ansible", "it"], ["GitLab CI/CD", "it"], ["Red Hat Satellite", "it"],
      ["Hyper-V", "it"], ["PowerShell", "it"],
      ["Docker", "it"], ["RHEL", "it"], ["documentation", "it"], ["Bash", "it"],
      ["SQL", "it"],

      ["PyOD", "research"], ["PyTorch", "research"], ["anomaly detection", "research"],
      ["side-channel", "research"], ["Hugging Face", "research"],
      ["Keras / TF", "research"], ["Python", "research"], ["R", "research"], /* ["CNNs", "research"] */
    ]
  },

  /* ---------- 3. resume ----------
     To show a real PDF: put the file in  assets/pdf/  and set
       file: "assets/pdf/resume.pdf"
     Leave file as "" and the section shows an empty viewer slot instead. */
  resume: {
    eyebrow:   "Resume",
    filename:  "",
    file:      "",
    slotTitle: "Resume",
    slotHint:  "drop the PDF into assets/pdf/ and name it in content.js"
  },

  /* ---------- 4. HPC internship ---------- */
  hpc: {
    eyebrow: "Experience — LANL",
    meta:    "Supercomputer Institute · May 2026 – August 2026",
    heading: "High-Performance Computing Intern",
    sublede: "Deployed and administered an HPC compute cluster with a peer team, and developed a novel boot method that reprovisions a node in seconds rather than minutes.",

    clusterTitle: "Cluster — head node + 4 chassis · 32 compute nodes",
    nodeInfo:     "Click any node for its state. The head node provisions with OpenCHAMI, schedules with Slurm, and holds configuration with Ansible.",

    clockTitle: "Reprovision time",
    clockNote:  "The counter is tied to the page: it winds down from the traditional reprovision window as this section comes into view and settles at the measured time for the container-and-hypervisor path.",
    facts: [
      { value: "containers + hypervisors", label: "virtual switch root" },
      { value: "MPI · HPL",                label: "benchmarked" },
      /* { value: "2026 Showcase",            label: "presented at LANL" } */
    ],

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
      slotHint:  "drop the PDF into assets/pdf/ and name it in content.js"
    }
  },

  /* ---------- 5. IT systems engineering ---------- */
  it: {
    eyebrow: "LANL",
    meta:    "June 2023 – May 2026",
    heading: "IT Systems Automation Intern",
    sublede: "Turned per-machine handwork into declared state. Introduce drift, then apply the playbook and watch the fleet converge.",
    legendNote: "illustrative — host count is not from the role",

    points: [
      "<b>Centralised the environment.</b> Stood up and administered Red Hat Satellite and GitLab servers, enabling centralized Linux package distribution and source code management across the group's IT development environment.",
      "<b>Replaced per-VM handwork.</b> Designed and implemented Ansible Automation Platform and PowerShell workflows for Hyper-V hypervisors, replacing manual per-VM configuration with automated, repeatable provisioning and state management.",
      "<b>Documented it.</b> Authored and maintained cross-platform documentation across Linux, Windows and Ansible, and provided troubleshooting support — giving new hires self-service references for common workflows and environment setup."
    ]
  },

  /* ---------- 6. hardware Trojan research ---------- */
  research: {
    eyebrow: "Intel Undergraduate Research Fellow",
    meta:    "New Mexico Institute of Mining & Technology · Aug – Dec 2026",
    heading: "Golden-chip-free hardware Trojan detection",
    sublede: "Both runs of the same AES core — Trojan dormant and Trojan triggered — drawn on top of each other inside the faint bundle of the other 53 measurements. The 2,500 samples run one revolution of a ring around the package they were measured from. Scrolling carries the sweep out from behind the chip, round the near side of the ring — closer, larger, brighter — and back in behind it, so both ends of the record stay out of sight.",

    legendA:   "inactive",
    legendB:   "triggered",
    traceNote: "2,500 samples · one revolution of the package",
    flowlink:  "each trace collapses to one point",

    featTitle: "Feature space — 54 measured traces",
    axisX:     "Mean dynamic power (mW)",
    axisY:     "EM band energy (norm.)",

    points: [
      "<b>The problem.</b> Evaluating anomaly detection models from the Python Outlier Detection (PyOD) library for golden-chip-free hardware Trojan detection on power and electromagnetic side-channel traces from AES Trojan variants (Trust Hub / IEEE DataPort).",
      "<b>Why it's hard.</b> Benchmarking detector effectiveness against classical baselines on unlabeled, imbalanced measurement data, where dormant Trojans separate from baseline circuits only by dynamic power draw."
    ],

    /* the small line under the description that changes as you use the plot.
       {id} is replaced with the trace being pointed at. */
    /* selinfoIdle:     "Hover a point to load its trace above. No labels and no golden reference — only the separation the detector can find on its own.",
    selinfoDetected: "ECOD and Isolation Forest agree — <b class=\"r\">AES-{id}</b> sits outside 3&sigma; on mean dynamic power. The rounds where it draws are marked on the trace above; on the trace alone the two runs are indistinguishable." */
  }
};
