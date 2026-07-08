LINK: https://asset-tracker-sable-beta.vercel.app/

<div align="center">

# 📊 Asset Tracker

**A Full-Stack, Type-Safe Financial & Asset Tracking Web Application**

[![Live Demo](https://img.shields.io/badge/Demo-Live_on_Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://asset-tracker-sable-beta.vercel.app/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)](https://supabase.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

<p align="center">
  <a href="https://asset-tracker-sable-beta.vercel.app/">
    <img src="https://via.placeholder.com/900x400/111111/ffffff?text=Drop+Your+App+Banner+or+Demo+GIF+Here" alt="Asset Tracker Preview Banner" width="90%">
  </a>
</p>

### [🚀 View Live Frontend Demo](https://asset-tracker-sable-beta.vercel.app/)

</div>

---

## 💡 Overview

**Asset Tracker** is a modern, full-stack web application designed to help users monitor, manage, and analyze their financial assets in real time. 

Built with a **React + TypeScript** frontend, the UI guarantees end-to-end type safety, responsive design, and intuitive data visualization. The client communicates with a high-performance **Python FastAPI** backend REST API, which handles data processing, business logic, and database operations. Persistent storage is managed via a relational **PostgreSQL** database hosted on **Supabase**, ensuring data integrity, scalability, and secure access.

---

## ✨ Key Features

- **⚡ Full-Stack Architecture:** Clean separation of concerns between a static, reactive client and a blazing-fast Python API.
- **🔒 Type-Safe UI:** Developed with TypeScript to eliminate runtime type errors and ensure seamless UI integration with backend API payloads.
- **🚀 High-Performance API:** Powered by FastAPI for asynchronous request handling, automatic OpenAPI/Swagger documentation, and lightning-fast data processing.
- **🗄️ Robust Relational Database:** Uses Supabase's managed PostgreSQL instance for structured, relational asset storage and querying.
- **🌐 Cloud-Native Deployment:** Frontend seamlessly deployed on **Vercel**, with the API backend hosted on **Render**.

---

## 🛠️ Tech Stack

### **Frontend (Client)**
* **Framework:** React
* **Language:** TypeScript
* **Styling & UI:** CSS / Tailwind CSS / Modern UI Components
* **Deployment:** [Vercel](https://vercel.com/)

### **Backend (API)**
* **Framework:** FastAPI
* **Language:** Python 3.x
* **API Documentation:** Swagger UI / ReDoc (built into FastAPI)
* **Deployment:** [Render](https://render.com/)

### **Database & Storage**
* **Database Engine:** PostgreSQL
* **Cloud Provider:** [Supabase](https://supabase.com/)

---

## 📁 System Architecture & Workflow

```text
+--------------------------------+          HTTP / REST API          +-----------------------------+
|     Frontend (Vercel)          | <-------------------------------> |      Backend (Render)       |
|  React + TypeScript SPA        |                                   |  Python + FastAPI Service   |
+--------------------------------+                                   +-----------------------------+
                                                                                    |
                                                                                    | SQL / ORM Queries
                                                                                    v
                                                                     +-----------------------------+
                                                                     |     Database (Supabase)     |
                                                                     |  PostgreSQL Relational DB   |
                                                                     +-----------------------------+
