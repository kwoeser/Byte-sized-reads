# Project Plan


## Milestones
- Friday Feb 21: Backend prototype completed
- Monday Feb 24: User auth implemented in backend
- Monday Feb 24: Frontend prototype completed, querying backend API
- Monday Feb 24: Scraper prototype completed using Python
- Friday Feb 28: Listing articles with filters implemented in backend
- Friday Feb 28: Submitting/approving articles implemented in backend
- Friday Feb 28: User auth integrated in frontend
- Friday Feb 28: Scraper integrated with database to update articles
- Monday March 3: Marking articles as read/bookmarked implemented in backend
- Monday March 3: List of articles with filters integrated in frontend
- Monday March 3: Moderator view and article approval integrated in frontend
- Monday March 3: Scraper scrapes approved articles automatically
- Friday March 7: List of read/bookmarked articles integrated in frontend
- Friday March 7: Software ready to be deployed (Dockerized, installation docs)
- Monday March 10: Software finalized
- Wednesday March 12: Documentation finalized


## Management Plan
Ideal Roles:
- Hazel: Backend
- Alen: Backend Database
- An: Front-End
- Karma: Front-End
- Jason: Front-end and Docker Implementation
- Sam: Web Scraper




Meeting Time: Mondays after class (3:20-4:00pm)


Meetings will include checking back on the milestone plan to see if roles need to be adjusted or if timeline needs to be moved. We will keep track of tasks and progress via github management tools. We will communicate through discord if we need to clarify anything or need to meet again before Monday arrives. We will decide on big devolpment decisions by voting on it.






## Implementation Plan:
- Step 1: Research/ Reimplementation of previous tools
    - Rationale: Starting with research and reimplementation makes us aware of the methods and tools that will help us along the way. Enables us to avoid repeating complex tasks.
    - Risk Reduction: Understanding these methods will allow us a smoother experience with making the system.
- Step 2: Development of Administrative Tools, Back-End, and Front-End
    - Rationale: The Parallel development of the back-end and front-end allows us to use the system early on. Working on both sides simultaneously helps with efficient integration.
    - Risk Reduction: Building both the front-end and back-end at the same time ensures the components are aligned and reduces integration mismatch.
- Step 3: Test Intermediate Prototype
    - Rationale: Testing early and often with an intermediate prototype ensures that both the back-end and front-end are functioning as expected
    - Risk Reduction:  This step allows for us to identify problems or inefficiencies in the system early.
- Step 4: Fix Bugs/ Make Improvements
    - Rationale: Fixing bugs ensures that the system is stable and operational.
    - This step ensures that problems are identified and addressed reducing the chances of error.
- Step 5: Test Final Product
    - Rationale: Testing the final product ensures that all components work together seamlessly. Allowing us to verify that we met every project goal along the way.
    - Risk Reduction: Thorough testing of the final product reduces the risk of unanticipated behavior. This ensures usability and reliability of the system.
- Step 6: Test Deployment for Website
    - Rationale: Helps identify issues related to hosting, security, and live interaction with the user.
    - Risk Reduction: Testing deployment helps catch deployment issues.
- Step 7: Final Product
    - Rationale: The final product should have all the previous steps done to be able to deliver a finished product.
    - Risk Reduction: The system has undergone a lot of testing to mitigate bugs that might have arrived.
- Step 8: Create Presentation
- Step 9: Documentation (done throughout project)
    - Rationale: Documenting throughout the project allows for clear ideas and the structure of the system.
    - Risk Reduction: Documenting reduces unnecessary additions to the system, a clear schedule, and keeps record for what has been done.




Risks and Mitigation Plan:
- Integration failure -> Write unit tests early.
- Delays in development -> Weekly check-ins will keep everyone accountable.
- Role management -> Have backup roles and reassign tasks if needed.
- Deployment failure -> Deploy only after tests pass using automation tools and have previous versions ready for quick rollback if needed
- Security issues -> We will implement authentication early




Intermediate Prototypes throughout the project:
- Basic Search Interface
    - A simple website where a user can put in a general subject and the system shows relevant articles
    - No keywords yet
- Expanded Search with Keyword Filtering
    - Users can improve their search by selecting keywords that are relevant to the general topic
    - The system then filters articles based on both the general topic and the keywords chosen.
- Backend and Database integration
    - Connect the backend to a database that holds article information
    - Make sure that the front end can get relevant and displays articles
- User configuration
    - Allow users to make their profiles.
    - Allows users to bookmark, mark as read, and rate the articles
    - Also, allow users to submit articles to be reviewed
- Final Testing & Performance Optimization
    - Make sure the Frontend and Backend are smoothly integrated
    - Test for bugs and speed






