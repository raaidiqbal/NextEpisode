# CS257-F24-TeamTemplate
Template for long-term team projects for CS257 Software Design Fall 2024

## Hosting

The original Flask frontend is in `templates/` and `static/`. The hosted Flask app uses the checked-in `Data/anime.csv` snapshot, so scores do not update live. To run it locally, install the dependencies from `pyproject.toml` and start `python flask_app.py`.

For Cloudflare Workers, run `npm install` and `uv sync`, then `npm run build:worker` and `uv run pywrangler deploy`. The build step packages the original CSV and Jinja templates as Python imports because Workers do not include those files automatically; it does not change the frontend. `wrangler.jsonc` serves the original CSS and JavaScript from Workers Static Assets.

The [GitHub Pages version](https://raaidiqbal.github.io/NextEpisode/) is an earlier static remake with a different interface.

NAMES:
- Christian Park
- Raaid Iqbal
- Omar Sobhy
- Matthew Hall

# Each of Our Contributions to the Project
Raaid: 

-Made tests for the command line and the Flask app

-Made the ‘About’ page

-Removed NSFW genres from the genre select menu and prevented them from appearing in the randomize function

-Helped in the making of the functions in datasource

-Worked on CIDER for each deliverable


Christian:

-Made the search feature

-Made the filtering function and pop ups

-Created the home page and individual show page

-Worked on search page

-CSS, design direction

-Worked with buttons and site navigation

Matthew: I worked on the following for this project:

-Tests for the command line and flask app

-The “Random” functionality

-The “About” page

-Detailing inclusivity problems and coming up with ideas to address them in our CIDER analyses

-Worked on creating the database

-Did some miscellaneous HTML and CSS work


Omar:

-Made Rankings page/feature

-Made Guide page

-Recolored all pages to follow a consistent color scheme

-Worked on refactoring some functions (e.g. Search function)

-Made blurring image feature to blur NSFW genre artworks

-Made/refactored some tests, particularly for Flask app

-Worked on the front-end design for all pages

-Worked on other features on the back-end



# Changes Made for the Final Project

## New Features-Tests were written for these new features
-A fully functional and user-customizable Rankings page.
-Genre blacklisting & searching through the search functionality.

## Front End Design Improvements
-Users expressed that they thought the purple color scheme was not compatible with the pink background. To address this, we recolored every element to follow a more laid-back red color-scheme. Therefore, every CSS file was modified.

-Almost every user found some columns in the search results confusing as they could not really tell what they were for (e.g. “Popularity” being a number, but there is nowhere that indicates that this number is for popularity). We made this change on the Search & Rankings pages (rankings.html, showlist.html, showlist.css) : added column titles to search to explain what the search results show for every column (e.g. Title, Genres, etc). Furthermore, our “Guide” page further explains the names of these columns.

-Users thought that searching by genre (which was unfinished, only available through following the URL convention) was not very intuitive. This fix is made on the homepage (homepage.html, homepage.css, homepage.js). We added two buttons to choose or exclude genres, and by clicking on these buttons a menu pops up with an intuitive design to easily choose/exclude genres, apply/clear all genres (with styled buttons to reflect their functionality), or search with chosen genres.

-Users occasionally expressed confusion about how to actually search for a title on our homepage, after typing something in the search bar. We addressed this usability issue in “homepage.html” by adding a magnifying glass on top of the search button on the homepage.

-Users found that they did not understand what some genres meant or what some columns meant (or how they were calculated, like Popularity for example). We added a “Guide” page (guide.html) explaining in detail what all of these terms are, which can be accessed through the “Guide” button on the homepage.

-Users sometimes found that they did not understand what some features were for and/or what the website is and/or how to fully utilize it. We made an “About” page to explain that, which can be accessed by clicking on the “About” button on the homepage. We changed the “homepage.html” page, “global.css,” and created the “about.html” file. 

-In addressing the problem above, we made another change to homepage.html. We added a subtitle describing what the website does: searches for Anime shows.

-It previously had been possible for a user to get an anime from a NSFW genre when clicking on the random button. We have made it impossible for this to happen now in order to make this functionality more inclusive for younger users. These changes were made in flask_app.py and services.py.

-One potentially small usability issue that existed was not knowing what page a user was on. To address this, the page that the user is on is now highlighted on the navigation bar and when you hover over one of the buttons, it expands and is highlighted. This change was made in global.css.

## Code Design Improvements

-We have abstracted out our search function into three different functions based on the tasks they perform. The main function now just calls a feature abstraction function and a search performing function (flask_app.py lines 20-37). Our search function had previously exemplified the code smells of having code at the wrong level of abstraction, a method doing more than one thing, having a method be more than one level of abstraction. This is because the search function previously had to get and process user input, and then generate the search results without helper functions. Therefore, the function had multiple levels of abstraction meaning that some of the code was also at the wrong level of abstraction.

-We renamed functions in flask_app.py in order to have a consistent naming convention. Instead of having some functions named in CamelCase, we have them all named in snake_case (flask_app.py lines 30, 36, 67, 101, 106). Previously, our function names in this file exemplified the code smell of inconsistency, since they did not all follow the same naming convention. 

-We renamed blur_image_check in flask_app.py (we moved this function into services.py after doing this) to is_inappropriate_genre as it returns a boolean value (True if genre is inappropriate) so it makes the code more readable (services.py line 20). This made the function name more descriptive, so it got rid of the code smell of having an indescriptive function name. It also helped us follow more standard nomenclature, by having a boolean function start with “is,” which is a common convention, making it easier for outsiders to understand what this function is doing.

-We have moved the get_image and is_inappropriate_genre from flask_app.py to their own file called services.py We believe that these functions should not be stored in the flask app file, because they exclusively deal with retrieving and processing outside data (services.py: the whole file). Therefore, these functions had been exemplifying the code smell of misplaced responsibility by being in flask_app.py.

-Other developers could easily get confused by links that are hard-coded in long lines of code, so we made a change to streamline our process of web scraping an image in flask_app.py. We made a variable for the anime image scraping link that is accessed through a call to our get_image function in services.py rather than it being hard-coded into the code – which means that one can easily change the link by modifying the variable and preventing it from being a mysterious link hardcoded in some line of code (flask_app.py lines 50 and 73). This does not seem to fit exactly with any of the code smells that we learned about, but it makes our code easier to edit in the future, more readable, and easier to understand.

-In addressing the issue above, we also changed the variable name for the not found image from “img” to “not_found_img” so that it could be more descriptive. (services.py lines 15 and 18). Therefore, this change got rid of the code smell of having an indescriptive variable name.

-We broke up the all_genres list in flask_app.py into more lines so that it is more readable in the code (flask_app.py lines 7-12). This does not fix a specific code smell, but is more readable than having the list of genres all on one line.




# Comments for the Flask Revision
The URL format for our functionality is as follows:

-Parentheses indicate that a particular part of the URL is variable. Do not actually enter parentheses in the URL.

-To enter get information for an anime based on the title, run the flask app and add /title?title=(name of title) to the website URL. This is not case sensitive.

-To filter the data by a genre, run the flask app and add /genres?genre=(genre to search by) to the website URL. This is not case sensitive. When on the page of anime from that genre, click on one of the rows to go to a page that displays the information about that anime in a more organized way.

-To filter the data by multiple genres, run the flask app and add /genres?genre=(genre to search by)&genre=(genre to search by) to the website URL adding as many ampersands as needed to filter by as many genres as you want.

-To get information about a random anime, run the flask app and add /random to the website URL. This is case sensitive and "random" must be all lowercase.

# Comments for the Front-End Deliverable
Currently, the "Home," "Advanced Search," and "Rankings" buttons in the navigation bar do nothing. We will most likely implement these for the final version of the project and may add more buttons to the navigation bar. The two features that allow a user to get information from the database on our website are the non-case-sensitive autocomplete search bar on the homepage and the "Random" button in the navigation bar on the homepage. 
To use the search bar, you can type in the title of an anime in the database or start to type a title, and then select the full title from the dropdown of autocomplete options that appear, or you can type anything at all. Then, you press the purple button to the right of the search bar to display anime that contain the characters that you typed in. From here you can hover over the row for a particular anime and click on it to display a graphic that contains a promotional image of the anime and information such as the animation studio that produced it, its genres, and score.
To use the "Random" button in the navigation bar, click on it. This will display the same type of graphic from the search functionality, but for a random anime from our database. 
Additionally, anime of particular genres that we have reason to believe will produce NSFW promotional images via webscraping have their pictures blurred out in the graphic display of their information.


# Comments for the Database Deliverable
We kept all of the columns in the dataset because all of the information in these columns is displayed when users filter by genres in order to give them the most information possible about those anime. We also may make functions to filter by at least some of these other columns in the future.

# Command Line App Instructions
The command line app has two functionalities at the moment:
- Filtering by genres
    -  This function returns a list of the MAL IDs which match every genre inputted
- Accessing the rating of an anime by its title
    - This function gives a rating out of 10 as seen on MAL



To filter by genres, run <code>python3 command_line.py --genres [genres to filter by]</code><br>
For example, try <code>python3 command_line.py --genres action comedy</code><br>
This will output a list of all MAL IDs which match both action and comedy.



To access ratings, run <code>python3 command_line.py --title \[title\]</code><br>
For example, try <code>python3 command_line.py --title Trigun</code><br>
This will output the rating for Trigun, which is 8.24.

To run our tests, run python3 Tests/test_cl.py.
