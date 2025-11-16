import doc1 from "./doc1.png";
import doc2 from "./doc2.jpeg";
import doc3 from "./doc3.avif";
import doc4 from "./doc4.png";
import doc5 from "./doc5.avif";
import doc6 from "./doc6.jpg";
import doc7 from "./doc7.webp";
import doc8 from "./doc8.jpg";
import doc9 from "./doc9.webp";
import doc10 from "./doc10.jpg";
import doc11 from "./doc11.jpg";
import doc12 from "./doc12.jpg";
import doc13 from "./doc13.png";
import doc14 from "./doc14.jpg";
import doc15 from "./doc15.webp";


const doctorData = [
  {
    id: 1,
    image: doc1,
    name: "Dr. Arjun Mehta",
    degree: "MBBS, MD (Internal Medicine)",
    specialization: "General Physician",
    location: "Mumbai, India",
    experience: "12+ years",
    fee: 600,
    rating: 4.7,
    reviews: 128,
    phone: "+91 98765 11223",
    email: "arjun.mehta@clinic.com",
    timings: [
      "Mon–Fri: 10:00 AM – 1:00 PM",
      "Mon–Fri: 5:00 PM – 8:00 PM",
      "Sat: 10:00 AM – 12:30 PM"
    ],
    bio: "Dr. Arjun is an experienced general physician known for accurate diagnoses and compassionate patient care."
  },
  {
    id: 2,
    image: doc2,
    name: "Dr. Ramesh Kapoor",
    degree: "BDS, MDS (Oral & Maxillofacial Surgery)",
    specialization: "Dental Surgeon",
    location: "Delhi, India",
    experience: "15+ years",
    fee: 800,
    rating: 4.9,
    reviews: 214,
    phone: "+91 99887 22334",
    email: "ramesh.kapoor@smiledental.com",
    timings: [
      "Mon–Sat: 9:30 AM – 1:30 PM",
      "Mon–Fri: 4:00 PM – 7:00 PM"
    ],
    bio: "Renowned dental surgeon specializing in painless root canals and advanced facial reconstructive procedures."
  },
  {
    id: 3,
    image: doc3,
    name: "Dr. Radhika Sharma",
    degree: "BAMS (Ayurveda Medicine & Surgery)",
    specialization: "Ayurveda Specialist",
    location: "Bengaluru, India",
    experience: "9+ years",
    fee: 500,
    rating: 4.6,
    reviews: 97,
    phone: "+91 90908 55667",
    email: "radhika.sharma@ayurclinic.com",
    timings: [
      "Mon–Fri: 10:00 AM – 1:00 PM",
      "Sat: 10:00 AM – 12:00 PM"
    ],
    bio: "Expert in natural healing, Panchakarma therapies, and Ayurvedic treatment plans for chronic conditions."
  },
  {
    id: 4,
    image: doc4,
    name: "Dr. Pranav Nair",
    degree: "BHMS (Homeopathic Medicine & Surgery)",
    specialization: "Homeopathic Doctor",
    location: "Kochi, India",
    experience: "10+ years",
    fee: 400,
    rating: 4.5,
    reviews: 84,
    phone: "+91 90909 44556",
    email: "pranav.nair@homeocare.com",
    timings: [
      "Mon–Fri: 10:30 AM – 2:00 PM",
      "Mon–Fri: 5:00 PM – 7:00 PM",
      "Sat: 10:00 AM – 1:00 PM"
    ],
    bio: "Specializes in holistic homeopathic treatment with a patient-first approach and long-term healing plans."
  },
  {
    id: 5,
    image: doc5,
    name: "Dr. Karan Patel",
    degree: "DM (Cardiology)",
    specialization: "Cardiologist",
    location: "Ahmedabad, India",
    experience: "18+ years",
    fee: 1200,
    rating: 4.9,
    reviews: 321,
    phone: "+91 98888 66778",
    email: "karan.patel@heartclinic.com",
    timings: [
      "Mon–Fri: 9:00 AM – 12:30 PM",
      "Mon–Fri: 4:30 PM – 7:00 PM"
    ],
    bio: "Highly respected cardiologist with extensive experience in interventional cardiology and heart disease prevention."
  },
  {
    id: 6,
    image: doc6,
    name: "Dr. Meera Gupta",
    degree: "DNB (Dermatology)",
    specialization: "Dermatologist",
    location: "Hyderabad, India",
    experience: "11+ years",
    fee: 900,
    rating: 4.8,
    reviews: 190,
    phone: "+91 90000 33445",
    email: "meera.gupta@skincare.com",
    timings: [
      "Mon–Sat: 10:00 AM – 2:00 PM",
      "Mon–Fri: 4:00 PM – 6:00 PM"
    ],
    bio: "Skin and hair specialist with expertise in laser treatments, acne therapy, and cosmetic dermatology."
  },
  {
    id: 7,
    image: doc7,
    name: "Dr. Amar Singh",
    degree: "MCh (Minimal Access Surgery)",
    specialization: "Laparoscopic Surgeon",
    location: "Chennai, India",
    experience: "16+ years",
    fee: 1300,
    rating: 4.8,
    reviews: 143,
    phone: "+91 95555 77889",
    email: "amar.singh@surgerycare.com",
    timings: [
      "Mon–Fri: 8:30 AM – 12:00 PM",
      "Sat: 9:00 AM – 11:00 AM"
    ],
    bio: "Specialist in minimally invasive surgeries with a focus on faster recovery and advanced surgical precision."
  },
  {
    id: 8,
    image: doc8,
    name: "Dr. Arjun Rao",
    degree: "MD (Psychiatry)",
    specialization: "Psychiatrist",
    location: "Pune, India",
    experience: "14+ years",
    fee: 850,
    rating: 4.7,
    reviews: 112,
    phone: "+91 93333 55667",
    email: "arjun.rao@mindclinic.com",
    timings: [
      "Mon–Fri: 11:00 AM – 3:00 PM",
      "Sat: 11:00 AM – 1:00 PM"
    ],
    bio: "Expert psychiatrist helping patients with anxiety, depression, and behavioral therapy using modern clinical methods."
  },
  {
    id: 9,
    image: doc9,
    name: "Dr. Rashmi Soni",
    degree: "MS (ENT / Otolaryngology)",
    specialization: "ENT Specialist",
    location: "Jaipur, India",
    experience: "8+ years",
    fee: 700,
    rating: 4.6,
    reviews: 76,
    phone: "+91 94444 88990",
    email: "rashmi.soni@entclinic.com",
    timings: [
      "Mon–Fri: 9:00 AM – 1:00 PM",
      "Sat: 9:00 AM – 12:00 PM"
    ],
    bio: "Experienced ENT specialist with expertise in sinus treatment, hearing disorders, and throat infections."
  },
  {
    id: 10,
    image: doc10,
    name: "Dr. Harish Krishnan",
    degree: "PhD (Neuropsychology)",
    specialization: "Neuro Specialist",
    location: "Hyderabad, India",
    experience: "20+ years",
    fee: 1500,
    rating: 4.9,
    reviews: 355,
    phone: "+91 96666 33221",
    email: "harish.krishnan@neuroclinic.com",
    timings: [
      "Mon–Fri: 10:00 AM – 1:00 PM",
      "Mon–Thu: 4:00 PM – 6:00 PM"
    ],
    bio: "Senior neuro specialist focusing on cognitive disorders, stroke rehabilitation, and advanced neurological diagnostics."
  },
  {
  id: 11,
  image: doc11,
  name: "Dr. Nisha Verma",
  degree: "MS (Ophthalmology)",
  specialization: "Eye Specialist",
  location: "Lucknow, India",
  experience: "13+ years",
  fee: 750,
  rating: 4.7,
  reviews: 142,
  phone: "+91 91234 55678",
  email: "nisha.verma@eyecare.com",
  timings: [
    "Mon–Fri: 10:00 AM – 1:30 PM",
    "Mon–Fri: 4:00 PM – 6:30 PM",
    "Sat: 10:00 AM – 12:00 PM"
  ],
  bio: "Experienced ophthalmologist specializing in cataract surgery, vision correction, and pediatric eye disorders."
},
{
  id: 12,
  image: doc12,
  name: "Dr. Sanjana Kulkarni",
  degree: "MD (General Medicine)",
  specialization: "Diabetologist",
  location: "Nagpur, India",
  experience: "17+ years",
  fee: 900,
  rating: 4.8,
  reviews: 198,
  phone: "+91 99881 22445",
  email: "sanjana.kulkarni@diabetescare.com",
  timings: [
    "Mon–Sat: 9:00 AM – 1:00 PM",
    "Mon–Fri: 5:00 PM – 7:00 PM"
  ],
  bio: "Specialist in diabetes management, insulin therapies, lifestyle planning, and chronic metabolic conditions."
},
{
  id: 13,
  image: doc13,
  name: "Dr. Kavita Menon",
  degree: "MD (Obstetrics & Gynecology)",
  specialization: "Gynecologist",
  location: "Trivandrum, India",
  experience: "14+ years",
  fee: 1000,
  rating: 4.9,
  reviews: 265,
  phone: "+91 90909 66789",
  email: "kavita.menon@womenscare.com",
  timings: [
    "Mon–Fri: 10:00 AM – 2:00 PM",
    "Mon–Thu: 5:00 PM – 7:30 PM"
  ],
  bio: "Dedicated gynecologist with expertise in maternity care, PCOS management, infertility evaluation, and women’s wellness."
},
{
  id: 14,
  image: doc14,
  name: "Dr. Rohit Shetty",
  degree: "MS (Orthopedics)",
  specialization: "Orthopedic Surgeon",
  location: "Mangalore, India",
  experience: "11+ years",
  fee: 1100,
  rating: 4.7,
  reviews: 173,
  phone: "+91 92222 88990",
  email: "rohit.shetty@bonecare.com",
  timings: [
    "Mon–Fri: 9:30 AM – 1:00 PM",
    "Sat: 10:00 AM – 12:00 PM"
  ],
  bio: "Orthopedic surgeon specializing in joint replacement, sports injuries, fractures, and advanced spine treatments."
},
{
  id: 15,
  image: doc15,
  name: "Dr. Snehal Pawar",
  degree: "MD (Pediatrics)",
  specialization: "Child Specialist",
  location: "Nashik, India",
  experience: "9+ years",
  fee: 650,
  rating: 4.6,
  reviews: 121,
  phone: "+91 93333 88977",
  email: "snehal.pawar@kidsclinic.com",
  timings: [
    "Mon–Fri: 10:00 AM – 1:00 PM",
    "Mon–Fri: 4:00 PM – 6:00 PM",
    "Sat: 10:00 AM – 12:00 PM"
  ],
  bio: "Caring pediatrician with experience in newborn care, childhood vaccinations, nutrition, and respiratory conditions."
}

];

export default doctorData;
