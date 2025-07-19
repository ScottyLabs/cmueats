# CMUEats

Visit the site [here](http://cmueats.com/).

Keep track of the statuses of the various dining locations across Carnegie Mellon University. Quickly access the menus and specials at each location without having to go through the arduous process of visiting the CMU Dining Website. The following are some instructions and (hopefully useful) hints on the CMUEats development process. Don't be afraid to ask questions if you are stuck!

## Developers

1. Join CMUEats' Slack channel (`#tech-cmueats`) in the ScottyLabs Slack. Feel free to also put questions in there.

2. Create an account on [Github](https://github.com). Later, you should also apply to get access to the [Github Student Developer Pack](https://education.github.com/pack).

3. To start developing, you'll need to download [Bun.js](https://bun.sh/docs/installation), [Git](https://git-scm.com/download/win), and an IDE (I recommend [VSCode](https://code.visualstudio.com)). You should also download [Github Desktop](https://desktop.github.com) to make development easier at the beginning. I recommend checking out [Learn Git Branching](https://learngitbranching.js.org) later.

4. If you followed my IDE recommendation, also download the [Prettier VSCode extension](https://marketplace.visualstudio.com/items?itemName=esben.prettier-vscode).

5. Any of the following steps where you type something (i.e. git clone…, bun install, etc.) should be done in your IDE's terminal.

6. Then, clone this repository to your computer by running `git clone https://github.com/ScottyLabs/cmueats.git` after making sure you have [git](https://git-scm.com/downloads) downloaded or running `gh repo clone ScottyLabs/cmueats` if you have the [Github CLI](https://cli.github.com/).

7. Next, run `git remote add upstream https://github.com/ScottyLabs/cmueats.git`.

8. Now use `git fetch upstream`.

9. Do the same for the dining API in a new location. This time, replace `https://github.com/ScottyLabs/cmueats.git`with `https://github.com/ScottyLabs/dining-api.git` and `ScottyLabs/cmueats` with `ScottyLabs/dining-api`.

10. If you already have the node_modules folder or package-lock.json from previous versions of the Dining API, please remove them before continuing.

11. Now install the CMUEats dependencies by ['cd'-ing](https://www.geeksforgeeks.org/cd-command-in-linux-with-examples/#) into the root of the location where you cloned CMUEats and running `bun install`. If you don't have Bun installed, you can install it using the instructions [here](https://bun.sh/).

12. Now run the code with `bun start` and it should work! Just click on the link that appears and you''ll see the web app. You can also use `bun run start` since `bun start` is its shorthand version

13. Now follow the installation steps for the dining API as well (steps 9 to 12).

14. To find bootcamp issues you can work on, please visit the [CMUEats issues page](https://github.com/ScottyLabs/cmueats/labels/bootcamp) or the [dining API issues page](https://github.com/ScottyLabs/dining-api/labels/bootcamp).

15. For every new issue or change you work on, first make sure your local repo is up-to-date with the ScottyLabs repo. To do this, go to your repo on your Github profile and click `Sync fork` if you are behind the main repo in commits. Then use `git pull origin main` in your IDE. Then type `cd main` in the local repository (folder containing all the code) for CMUEats or the dining API then type `git checkout -b branch-name`, where `branch-name` is the branch you want to work on (see [Learn Git Branching](https://learngitbranching.js.org)). To work on changes to a branch you already created, use `git checkout branch-name`, where `branch-name` is the branch you already created. Make sure to use `git checkout main` every time you are ready to create a new branch.

16. When you want to commit changes, first stage changes with `git add .`. Then, use `git commit -m "commit message"` (alternatively commit using Github Desktop). To undo commits, use `git reset --hard (HEAD~# or commit-id)` (`--hard` removes staged and unstaged changes after commit chosen to reset to; `--soft` keeps changes in working directory and keeps reset commits in staging area). Replace `#` with the number of commits you want to go back by. Similarly, using `@{#}` instead of `~#` undos the reset (not necessarily just simplified). When you are ready to push changes, use `git push -u origin branch-name`. To push new commits after this, use `git push -f` instead.

17. When you want to create a pull request for your changes, go to the ScottyLabs repo on the Github website and click on `Pull Requests`. Click on `New Pull Request`. On the right side, click on your repo's branch you want to merge from, and, on the left side, make sure you have ScottyLabs' `main` branch selected. Create a description then create the pull request. Feel free to request reviewers or ask a tech lead directly, so they can review your pull requests and requests changes or merge it.

Note that GitHub will automatically run checks (workflows) on your PR. This includes code linting (with tsc and eslint) and verifying that all unit tests in `/tests` pass with vitest.

![Example checks](/public/checks_example.png)

17. To run unit tests locally, type `bun test`.

Note: To add new dependencies, use `bun add dependency-name`. To remove dependencies, use `bun remove dependency-name`. Run `bun outdated` to see what dependencies are outdated and `bun update` to update all outdated dependencies to the latest version.

## CSS, the way it was meant to be written™

CMUEats is in the process of transitioning from CSS-in-JS components to pure CSS. Most class names follow the [BEM](https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) (Block, Element, Modifier) convention and strongly limit nested selectors (eg. .block-1 .block-2), but some legacy code may not. (PRs to fix these or remove CSS components are strongly encouraged!)

![image](https://github.com/user-attachments/assets/6292992f-c599-4203-ae0c-9983599d6bde)

## Local Development

1. Start the dining-api backend:
   ```
   cd ../dining-api
   bun install
   bun run dev
   ```
   This runs the dining-api server on port 5010.

2. Start the frontend:
   ```
   bun run dev
   ```
   This runs the Vite dev server on port 5173.

## Production/Deployment

- Set `DATABASE_URL` in your dining-api Railway project's environment variables.
- Set `VITE_API_BASE` in your frontend deployment to point to the dining-api URL.

- Deploy dining-api to Railway with the start command:
  ```
  bun run start
  ```

