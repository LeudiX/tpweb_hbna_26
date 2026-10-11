# Git CLI BIBLE

## Crear nuevo repositorio

- Ir a la carpeta y crear un gitignore con los archivos/carpetas que se quieren omitir del tracking
- Abrir carpeta en el terminal
- git init
- GIT FLOW
`Nota:` Si no tienes ramas master por default, puedes añadir los cambios, crear un commit y la rama local
master será creada por defecto, luego aplicas GIT FLOW

## Recomendaciones

    - Intentar trabajar con el entorno actualizado
    - Intentar mezclar en tu local antes de subir

    ```bash
    ssh -T git@code.pyxelsolution.com  # Pin inicial con SSH al repositorio remoto 
    git remote add origin  <url_repo_origin>
    git fetch origin <branch_name>
    git checkout -b develop origin/develop # crea develop a partir de origin/develop
        git pull origin <branch_name>

    git clone -b <branch_name> --single-branch <repository_url>
    git remote set-url origin https://github.com/LeudiX/<repository_url>.git
    git remote set-url origin git@<repository_url>.git
                             Ej: https://code.tecnosolution.com/odoo/molly.git
    git remote `or` git remote -v # Muestra la informacion del repositorio remoto
    git remote get-url origin # Muestra la URL del repositorio remoto

    git status # Notifies in real time about the changes in the current repository
    git log -n # Show the commits history (limited to the last n number of commits)
    git branch # Muestra todas las ramas creadas en el entorno local
    git branch -a # Muestra todas las ramas locales y remotas del repositorio
    
    git add  # Add the modified or untracked files from the working directory to the staging area
    git restore `[file-location]` # Discard the changes in the working repository
    git commit -m ''  # Add the changes from the stagin area to the git repository
    
    Hard Reset: git reset --hard HEAD~1 - Completely remove the last commit and discard changes.
    Soft Reset: git reset --soft HEAD~1 - Remove the last commit but keep changes in the working directory.
    
    git fetch # Muestra los cambios del repositorio remoto sin actualizar
    git pull # Actualiza los cambios del remote en el repositorio local
    git push -u origin master # Hacer la 1ra vez parq informarle al remoto de tracear la rama especificad en el futuro
    git push origin user_guide # Sube los cambios realizados en la rama especificada hacia la remota
    git push origin master --force # Forzar solo en casos especiales
    git merge user_guide # Mezcla los cambios de la rama user_guide en la rama en la que estes ubicado (master)
    git push origin develop # Solicitar el merge en la rama remota correspondiente
    git checkout -b develop origin/develop # crea develop a partir de origin/develop *****
    git checkout develop # Move to the branch develop
    git branch -m <oldname> <newname> # Rename branch pointing to any branch
    git branch -D develop  # Elimina la rama develop en el local
    git push origin -d [branch_name] # Elimina la rama en el repositorio remoto
    git branch -rm -r develop  # Elimina las carpetas y archivos especificados 

    git rm --cached <file_name> # Ex: rm --cached .gitignore
    git commit -m "Remove .gitignore from repo"
    ```

## Working File path Sample

odoo\addons\portal\views\portal_templates.xml

## Full Path: D:\GitHub\tpweb_prov_26\README.md

## Relative Path: README.md