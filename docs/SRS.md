# ByteSized Reads
# Software Requirements Specification

## Table of Contents
1. SRS Revision History
2. The Concept of Operations (ConOps)
   - 2.1. Current System
   - 2.2. Justification for a New System
   - 2.3. Operational Features of the Proposed System
   - 2.4. User Classes
   - 2.5. Modes of Operation
   - 2.6. Usage Examples
     - 2.6.1. Use Cases
     - 2.6.2. Operational Scenarios
3. Requirements
   - 3.1.	External Interfaces
   - 3.2.	Functions
      - 3.2.1.	Must-Have Requirements
      - 3.2.2.	Should-Have Requirements
      - 3.2.3.	Could-Have Requirements
      - 3.2.4	Won’t-Have Requirements
    - 3.3.	Usability Requirements
    - 3.4. 	Performance Requirements
    - 3.5.	Software System Attributes

## 1. SRS Revision History  

| Date       | Author                | Description                          |  
|------------|-----------------------|--------------------------------------|  
| 02/21/2025 | SE, AM, HP, AW, JW, KW | Initial draft creation              |  
| 02/25/2025 | SE, AM                 | Added more to section 2             |  
| 02/26/2025 | SE, AM                 | Finalized Document and added TOC    |  

## 2. The Concept of Operations (ConOps)  

The project aims to build a web-based application called **ByteSized Reads** that users can use for personalized reading recommendations, primarily focused on medium-length reading (5-30 minutes).  

### 2.1. Current System  
Users looking for online articles face challenges in finding content that matches both their interests and reading constraints including time and comprehension level. While plenty of online content exists, filtering through them to find “the right one” is time-consuming and often results in users starting articles they cannot finish or fully understand, leading to an inefficient and frustrating reading experience. We aim to provide a convenient, personalized approach to content discovery. Having a central directory of content also allows us to provide additional filters and parameters for finding content, and keep track of what the user has already read and enjoyed.  

### 2.2. Justification for a New System  
Short-form reading such as microblogging (e.g., Twitter) is already highly algorithmic and personalized. Some systems exist for book recommendations, and there are many curated resources. However, medium-length reading such as online articles and blog posts tends to be less discoverable. Readers seeking medium-length content typically curate their own collections of sites discovered over time.  

### 2.3. Operational Features of the Proposed System  
**ByteSized Reads provides:**  
- **Article recommendations** based on three key criteria:  
  - Topic *(computers, travel, games)*  
  - Reading time/length *(5-10 mins, 10-20 mins, 20+ mins)*  
  - Article difficulty level *(Beginner, Intermediate, Advanced)*  
- **Article tracking** *(read/unread status)*  
- **A customized login** to a website that curates articles via a search engine  
- **Web scraping functionality** to collect articles from approved sources  
- **Docker-based deployment** for ease of installation and maintenance  

### 2.4. User Classes  
- **End users**: People who use the system to find reading recommendations. Expected to have basic web browsing skills.  
- **Moderators**: Privileged users who perform data curation and other moderation tasks. Expected to be familiar with using web applications.  
- **Administrators**: Users who operate the system, including deployment and ongoing support and maintenance. Expected to be familiar with operating software applications.  

### 2.5. Modes of Operation  
The project will showcase two different modes:  
#### End User Mode (main program):  
- Allows access to the database search engine  
- Account management  
- Article discovery and reading  

#### Moderator/Admin Mode:  
- Allows for data uploads to increase project scope  
- Allows for system updates and debugging  
- Given access to additional web pages for article submissions  

### 2.6. Usage Examples  

#### 2.6.1. Use Cases  
- **As a user**, I want to find something interesting, so I can have fun.  
- **As a user**, I want to find something short, so I can finish it in my available time.  
- **As a researcher**, I want to find articles by topic, so I can synthesize them.  
- **As a user**, I want to keep track of what I’ve already read, so I don’t see them again.  
- **As a user**, I want to see things I already read, so I can find them in the future.  
- **As an administrator**, I want content to be moderated, so I can prevent spam.  
- **As an administrator**, I want the software to be easy to deploy, so it’s not time-consuming.  

#### 2.6.2. Operational Scenarios
#### **Scenario 1: Time Management**  
**Brief Description:** This scenario describes how a busy professional finds and reads articles that fit into their limited available time between work commitments

**Actors:** End user (Max, a software developer)  

**Preconditions:**  
- Max has an account on ByteSized Reads
- Max has set selected computer topics of interest in their profile
- Max has specified their available reading time 

**Steps to Complete the Task:**  
1. Max logs into ByteSized Reads.  
2. He applies a filter for articles within 5-10 minutes.  
3. The system displays a list of relevant articles.  
4. Max selects an article and reads it.  
5. The system marks the article as read.  

**Postconditions:**  
- Max reads an article within his available time.  
- The article is logged in his reading history.  

---

#### **Scenario 2: Accessibility of Content**  
**Brief Description:** This scenario describes how a beginner gamer finds content that matches their comprehension level to learn about a topic without feeling overwhelmed

**Actors:** End user (Billy, a student)  

**Preconditions:**  
- Billy has an account on ByteSized Reads
- Billy has selected “Video Games” as their topics of interest in their profile
- Billy has indicated “beginner” as their knowledge level for gaming topics

**Steps to Complete the Task:**  
1. Billy logs into his account.  
2. He navigates to the recommendation dashboard
3. He applies a filter for “Beginner” difficulty-level articles 
4. The system displays a list of articles that match the constraints and Billy's interests  
5. He selects and reads an article that appeals to him  
6. Upon completion of the article, the system will mark the article as read 

**Postconditions:**  
- Billy has gained an understanding of a gaming concept at an appropriate difficulty level  
- The system has recorded the article as read in the user’s history
- The article will not appear in future recommendations unless explicitly requested

---

#### **Scenario 3: Organization of Information**  
**Brief Description:** This scenario describes how a trip planner discovers articles to plan a travel itinerary.

**Actors:** End user (Lisa, a trip planner) 

**Preconditions:**  
- Lisa has created an account on ByteSized Reads
- Lisa has selected travel topics of interest in their profile


**Steps to Complete the Task:**  
1. Lisa logs into their ByteSized Reads account
2. She navigates to the recommendation dashboard
3. She selects an article
4. She reads the article and uses the bookmark feature to save it
5. She goes back to the recommendation dashboard and repeats steps 3-4 until satisfied with the travel plans
 

**Postconditions:**  
- The user has created a collection of articles
- The system has recorded the article as read in the user’s history
- The article will not appear in future recommendations unless explicitly requested

---

## 3. Requirements  

### 3.1. External Interfaces  

**User Input Interface**  
- **Description**: Allows users to log in and set preferences (topic, difficulty)  
- **Source**: End Users  
- **Range**: Topics, Difficulty Settings, Username/Password  
- **Data Format**: HTML, String to JSON  

**Article Submission Interface**  
- **Description**: Allows Moderators/Administrators to submit new data/articles  
- **Source**: Moderators/Admins  
- **Data Format**: URL Link to Admin Tool  

**Output Interface**  
- **Description**: Outputs selected articles  
- **Destination**: End Users  
- **Data Format**: HTML to embedded URL  

### 3.2. Functions  

#### 3.2.1. Must-Have Requirements  
- The system must provide article recommendations based on user-selected topics  
- The system must filter articles based on estimated reading time  
- The system must categorize articles by difficulty  
- Users must be able to log in to store their data  
- Users must be able to mark articles as read  
- Users should be able to see articles they’ve read  
- The system should not recommend articles that have already been read  
- Users should be able to submit new articles  
- Moderators should be able to approve submitted articles  
- The system should scrape approved articles  
- The system must load article recommendations within **5 seconds**  
- The system must accurately estimate reading times within **±2 minutes**  
- The system must be built automatically using **Docker**  
- The system must be deployed using **Docker Compose**  
- The system must follow an **agile software development lifecycle**  
- **User passwords must be stored securely**  

#### 3.2.2. Should-Have Requirements  
- The user should be able to **bookmark** articles  
- The user should be able to **rate** articles  
- The user should be able to **sort articles by rating**  
- The system should have a **simple search function**  

#### 3.2.3. Could-Have Requirements  
- The system could have a **favorites list**  
- The system could display **reading progress**  

#### 3.2.4. Won’t-Have Requirements  
- The system **won’t support offline reading**  
- The system **won’t include a commenting system**  

### 3.3. Usability Requirements  
- System loads article recommendations within **5 seconds**  
- User preference selection requires **no more than 3 clicks**  

### 3.4. Performance Requirements  
- Reading time estimates are accurate within **±2 minutes**  
- API response time is **under 3 seconds** for all operations  

### 3.5. Software System Attributes  
- **Security**  
  - Authentication is required for personalized features  
  - User passwords are stored securely using hashing
- **Maintainability**
  - System is built using Docker for containerization
  - Components are modularized for easier updates
