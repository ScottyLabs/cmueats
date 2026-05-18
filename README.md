# CMUEats

Visit the site [here](http://cmueats.com/).
Visit the staging website [here](http://staging.cmueats.com/).

Keep track of the statuses of the various dining locations across Carnegie Mellon University. Quickly access the menus and specials at each location without having to go through the arduous process of visiting the CMU Dining Website. The following are some instructions and (hopefully useful) hints on the CMUEats development process. Don't be afraid to ask questions if you are stuck!

## Developers

1. Join CMUEats' Slack channel (`#tech-22-cmueats`) in the ScottyLabs Slack. Feel free to also put questions in there.

2. Create an account on [Github](https://github.com). Later, you should also apply to get access to the [Github Student Developer Pack](https://education.github.com/pack).

3. To start developing, you'll need to download [pnpm](https://pnpm.io/installation), [Git](https://git-scm.com/download/win), and an IDE (I recommend [VSCode](https://code.visualstudio.com)). You should also download [Github Desktop](https://desktop.github.com) to make development easier at the beginning. I recommend checking out [Learn Git Branching](https://learngitbranching.js.org) later.

4. If you're using VSCode, also download the Oxc extension for inline linting and auto-formatting.

5. Any of the following steps where you type something (i.e. git clone…, pnpm install, etc.) should be done in your IDE's terminal.

6. Then, clone this repository to your computer by running `git clone https://github.com/ScottyLabs/cmueats.git` after making sure you have [git](https://git-scm.com/downloads) downloaded or running `gh repo clone ScottyLabs/cmueats` if you have the [Github CLI](https://cli.github.com/).

7. Do the same for the dining API in a new location. This time, replace `https://github.com/ScottyLabs/cmueats.git` with `https://github.com/ScottyLabs/dining-api.git` and `ScottyLabs/cmueats` with `ScottyLabs/dining-api`.

8. If you already have the node_modules folder or package-lock.json from previous versions of the Dining API, please remove them before continuing.

9. Now install the CMUEats dependencies using `pnpm install`. If you don't have pnpm installed, you can install it using the instructions [here](https://pnpm.io/installation).

10. Populate a top-level `.env` file with the secrets from our Notion page. (ask us on Slack for the link!) Now run the code with `pnpm dev` and it should work! Just click on the link that appears and you'll see the web app.

11. Now follow the installation steps for the dining API as well (steps 9, 10).

12. To find bootcamp issues you can work on, please visit the [CMUEats issues page](https://github.com/ScottyLabs/cmueats/labels/bootcamp) or the [dining API issues page](https://github.com/ScottyLabs/dining-api/labels/bootcamp).

13. For every new issue or change you work on, first make sure your local repo is up-to-date with the ScottyLabs repo with `git pull origin main`. Create a new branch off of your current one with `git switch -c <branch-name>` (the normies use `git checkout -b <branch-name>`. that was a joke. don't kill me plz.)

14. When you want to commit changes, first stage changes with `git add .`. Then, use `git commit -m "commit message"` (alternatively commit using Github Desktop). To undo commits, use `git reset --hard (HEAD~# or commit-id)` (`--hard` removes staged and unstaged changes after commit chosen to reset to; `--soft` keeps changes in working directory and keeps reset commits in staging area). Replace `#` with the number of commits you want to go back by. Similarly, using `@{#}` instead of `~#` undos the reset (not necessarily just simplified). When you are ready to push changes, use `git push -u origin branch-name`. To push new commits after this, use `git push -f` instead.

15. When you want to create a pull request for your changes, go to the ScottyLabs repo on the Github website and click on `Pull Requests`. Click on `New Pull Request`. On the right side, click on your repo's branch you want to merge from, and, on the left side, make sure you have ScottyLabs' `main` branch selected. Create a description then create the pull request. Feel free to request reviewers or ask a tech lead directly, so they can review your pull requests and requests changes or merge it. If the tech lead(s) are doing their job, you should get a response within 1 to 2 days. Assuming it's not midterm or finals season. But if it is, shouldn't you be studying instead of working on cmueats anyways?

Note that GitHub will automatically run checks (workflows) on your PR. This includes code linting (with tsc and oxlint) and verifying that all unit tests in `/tests` pass with vitest.

![Example checks](/public/checks_example.png)

16. To run unit tests locally, type `pnpm run test`.

Note: To add new dependencies, use `pnpm add dependency-name`. To remove dependencies, use `pnpm remove dependency-name`. Run `pnpm outdated` to see what dependencies are outdated and `pnpm update` to update all outdated dependencies to the latest version.

## Accessing historical API data

<https://web.archive.org/web/20250000000000*/https://dining.apis.scottylabs.org/locations>
(Thanks @GhostOf0days)

Archives of the official dining site can be found on <https://web.archive.org/web/20250000000000*/https://apps.studentaffairs.cmu.edu/dining/conceptinfo/>.
Individual concept pages are also scraped (ex. <https://web.archive.org/web/20250000000000*/https://apps.studentaffairs.cmu.edu/dining/conceptinfo/Concept/113>), although accuracy may vary since the dining site sometimes glitches and returns a CLOSED status for a day that has opening times.

## CSS, the way it was meant to be written™

CMUEats is in the process of transitioning from CSS-in-JS components to pure CSS. Most class names follow the [BEM](https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) (Block, Element, Modifier) convention and strongly limit nested selectors (eg. .block-1 .block-2), but some legacy code may not. (PRs to fix these or remove CSS components are strongly encouraged!)

![image](https://github.com/user-attachments/assets/6292992f-c599-4203-ae0c-9983599d6bde)

## Local Development

### Method 1: use dummy data

In `.env`, change the field `VITE_API_URL` to be `locations.json`.
This will use the file at `public/locations.json` as the data.
E.g.:

```txt
VITE_API_URL=locations.json
```

(If you're testing this on mobile, you should write out the full URL to the static file, making sure to replace `localhost` with your device IP instead.)

### Method 2: setup backend server

1. Start the dining-api backend:

   ```
   cd ../dining-api
   pnpm install
   pnpm run dev
   ```

   This runs the dining-api server on port 5010.

2. Start the frontend:

   ```
   pnpm run dev
   ```

   This runs the Vite dev server on port 5173.

## Production/Deployment

- Set `DATABASE_URL` in your dining-api Railway project's environment variables.

- Deploy dining-api to Railway with the start command:

  ```
  pnpm run start
  ```

## Updating the OpenAPI spec types

Update the `api.yaml` file, and run

```shell
pnpm run api-update
```
