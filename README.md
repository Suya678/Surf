# HomeSurf

> A peer-to-peer housing platform that connects individuals in urgent need of short-term shelter with local hosts offering spare rooms or temporary space.

![HomeSurf Banner](client/public/HomeSurfLogo.png)

---

## 🌟 Inspiration
HomeSurf was created to address the limitations of traditional emergency housing, which is often too slow or rigid to meet sudden needs for temporary shelter.  
We realized that critical gaps in safety nets leave vulnerable individuals without safe options when institutional resources are unavailable.  

HomeSurf leverages *community generosity* — connecting those who can help with those who need immediate, short-term housing.

---

## 💡 What It Does
HomeSurf is a **peer-to-peer connection platform** that provides immediate, short-term relief by utilizing spare housing capacity within a city.  

It serves two main user groups:

- 🏡 **Hosts** — Citizens who can securely list spare rooms or available space.  
- 👤 **Guests** — Individuals facing sudden displacement or transitions who urgently need safe, temporary shelter.

### Key Features
- Secure host and guest registration  
- Real-time listings with verified locations  
- Search and filter by city or availability  
- Easy host onboarding with form-based listing creation  
- Clean and accessible UI built with DaisyUI + Tailwind CSS  

---

## 🧱 How We Built It
**Tech Stack:**
- **Frontend:** React + DaisyUI (Tailwind)  
- **Backend:** Node.js + Express.js  
- **Database:** PostgreSQL  
- **Maps Integration:** Google Maps API + Leaflet.js  
- **Hosting & Deployment:** Railway (backend) + Vercel (frontend)

**Architecture:**
- The backend exposes RESTful APIs for authentication, user registration, and listings management.  
- PostgreSQL stores users, bookings, and listing data.  
- Google Maps API ensures valid geolocation for each listing.  
- Railway deployment keeps both the server and database connected for easy scalability.

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repo
```bash
git clone https://github.com/<yourusername>/surf.git
cd surf
