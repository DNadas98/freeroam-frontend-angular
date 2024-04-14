<p align="center">
  <a href="https://github.com/DNadas98/freeroam-hiking-companion/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/DNadas98/freeroam-hiking-companion.svg?style=for-the-badge" alt="Contributors">
  </a>
  <a href="https://github.com/DNadas98/freeroam-hiking-companion/issues">
    <img src="https://img.shields.io/github/issues/DNadas98/freeroam-hiking-companion.svg?style=for-the-badge" alt="Issues">
  </a>
  <a href="https://github.com/DNadas98/freeroam-hiking-companion/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/DNadas98/freeroam-hiking-companion.svg?style=for-the-badge" alt="License">
  </a>
  <a href="https://linkedin.com/in/daniel-nadas">
    <img src="https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555" alt="LinkedIn">
  </a>
</p>

<br xmlns="http://www.w3.org/1999/html"/>
<div align="center">
  <a href="https://github.com/DNadas98/freeroam-hiking-companion">
    <img src="https://avatars.githubusercontent.com/u/125133206?v=4" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">FreeRoam Hiking Companion Application</h3>
  <p align="center">
    Created by <a href="https://github.com/DNadas98">DNadas98 (Dániel Nádas)</a>
    <br />
    <a href="https://github.com/DNadas98/freeroam-hiking-companion/issues">Report Bug</a>
    ·
    <a href="https://github.com/DNadas98/freeroam-hiking-companion/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#deployment">Deployment</a></li>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#setup--run">Setup and run</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#images">Images</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

The FreeRoam Hiking Companion Application is a personal development project aimed at enhancing my skills in AngularJS and Java Spring Microservices, while merging my passion for hiking with technology. This application is designed to serve as a comprehensive hiking trip planner where users can explore various hiking-related points of interest such as peaks, summits, and trails. Users can access detailed information, download route GPX files, and personalize their experience by creating an account to favorite locations and upload their own trail data. This project is currently in the initial phases of development, designed with scalability in mind to continuously integrate additional features and new technologies. The aim is to create an extendable platform that not only supports my learning objectives but also enhances the hiking community's access to valuable content.

## Repositories & Tech Stack
The architecture of the project leverages a microservices approach, incorporating several key components:

#### Main Project Repository
- [freeroam-hiking-companion](https://github.com/DNadas98/freeroam-hiking-companion)

#### Angular Client
- The client application with a dynamic map system, that allows users to explore trails and summits on open-source maps.
- Repository: [freeroam-frontend-angular](https://github.com/DNadas98/freeroam-frontend-angular)
- Technologies used:  
[![Angular JS](https://img.shields.io/badge/-Angular_JS-C3002F?style=for-the-badge&logo=angular&logoColor=black)](https://angular.io/)
[![Typescript](https://img.shields.io/badge/-Typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=black)](https://www.typescriptlang.org/)
[![Angular Material UI](https://img.shields.io/badge/-Angular_Material_UI-005CBB?style=for-the-badge&logo=materialui&logoColor=white)](https://material.angular.io/)
[![Leaflet JS](https://img.shields.io/badge/-Leaflet_JS-FFD62D?style=for-the-badge)](https://leafletjs.com/)

#### Keycloak Authorization Server:
- An open source authorization server utilized to handle secure user authentication via OpenID Connect, manage service-to-service communication through OAuth2, and provide a dashboard for efficient administration of users, roles, and permissions.
- Repository: [freeroam-keycloak](https://github.com/DNadas98/freeroam-keycloak)
- Technologies used:  
[![Keycloak](https://img.shields.io/badge/-Keycloak_Authorization_Server-008AAA?style=for-the-badge)](https://www.keycloak.org/)
[![Docker](https://img.shields.io/badge/-Docker-1d63ed?style=for-the-badge&logo=docker&logoColor=black)](https://www.docker.com/)

#### Eureka Discovery Service:
- Manages service registration and discovery, enabling dynamic interaction between the microservices.
- Repository: [freeroam-eureka](https://github.com/DNadas98/freeroam-eureka)
- Technology used:  
[![Eureka Discovery Service](https://img.shields.io/badge/-Eureka_Discovery_Service-CCCCCC?style=for-the-badge)](https://github.com/Netflix/eureka)  

#### Reactive Spring Gateway:
- Acts as an intelligent router that directs incoming API requests to the appropriate backend services, facilitating a responsive user experience.
- Repository: [freeroam-gateway](https://github.com/DNadas98/freeroam-gateway)
- Technology used:  
[![Spring Gateway](https://img.shields.io/badge/-Spring_Gateway-589133?style=for-the-badge&logo=spring&logoColor=black)](https://docs.spring.io/spring-cloud-gateway/reference/spring-cloud-gateway.html)

#### Summits Service:
- Collects and manages data related to summits and peaks, offering access to extensive geographical and hiking trail information.
- Repository: [freeroam-summits](https://github.com/DNadas98/freeroam-summits)

#### Trails Service:
- Focuses on managing trail routes, first the ones collected from open APIs, then later on in development also the user-uploaded ones.
- Repository: [freeram-trails](https://github.com/DNadas98/freeroam-trails)


#### Programming Languages

[![Java](https://img.shields.io/badge/-Java-ED8B00?style=for-the-badge)](https://www.java.com/en/)
[![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=for-the-badge)](https://www.java.com/en/)  

  
#### Security
[![Spring Security](https://img.shields.io/badge/-Spring_Security-589133?style=for-the-badge&logo=spring&logoColor=black)](https://spring.io/projects/spring-security)
[![Spring OAuth2 Client](https://img.shields.io/badge/-Spring_OAuth2_Client-589133?style=for-the-badge&logo=spring&logoColor=black)](https://docs.spring.io/spring-security/reference/reactive/oauth2/client/index.html)
[![Spring OAuth2 Resource_Server](https://img.shields.io/badge/-Spring_OAuth2_Resource_Server-589133?style=for-the-badge&logo=spring&logoColor=black)](https://docs.spring.io/spring-security/reference/reactive/oauth2/resource-server/index.html)

#### Database, ORM

[![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4479A1?style=for-the-badge&logo=postgresql&logoColor=black)](https://www.postgresql.org/)
[![Hibernate ORM](https://img.shields.io/badge/-Hibernate_ORM-CCCCCC?style=for-the-badge&logo=hibernate&logoColor=black)](https://hibernate.org/orm/)
[![Spring Data JPA](https://img.shields.io/badge/-Spring_Data_JPA-589133?style=for-the-badge&logo=spring&logoColor=black)](https://spring.io/projects/spring-data-jpa)

#### Integration and Deployment

[![Docker](https://img.shields.io/badge/-Docker-1d63ed?style=for-the-badge&logo=docker&logoColor=black)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/-Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=black)](https://kubernetes.io/)
[![GitHub Actions](https://img.shields.io/badge/-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=black)](https://github.com/features/actions)
[![Nginx](https://img.shields.io/badge/-Nginx-227722?style=for-the-badge&logo=nginx&logoColor=black)](https://www.nginx.com/)

## Getting Started

### Deployment

WORK IN PROGRESS

### Prerequisites

WORK IN PROGRESS

### Setup & Run

WORK IN PROGRESS

## Usage

WORK IN PROGRESS

## Roadmap

- See the [open issues](https://github.com/DNadas98/freeroam-hiking-companion/issues) for a
  full list of proposed features (and known issues).

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Images

<table>
  <tr>
    <td>
      <img src="https://raw.githubusercontent.com/DNadas98/freeroam-hiking-companion/main/screenshots/Screenshot_20240414_140952.png" alt="Screenshot 1"/>
    </td>
    <td>
      <img src="https://raw.githubusercontent.com/DNadas98/freeroam-hiking-companion/main/screenshots/Screenshot_20240414_141111.png" alt="Screenshot 2"/>
    </td>
  </tr>
</table>

## Contact

Dániel Nádas

- My GitHub profile: [DNadas98](https://github.com/DNadas98)
- My webpage: [dnadas.net](https://dnadas.net)
- E-mail: [daniel.nadas@dnadas.net](mailto:daniel.nadas@dnadas.net)
- LinkedIn: [Dániel Nádas](https://www.linkedin.com/in/daniel-nadas)

Project
Link: [https://github.com/DNadas98/freeroam-hiking-companion](https://github.com/DNadas98/freeroam-hiking-companion)
