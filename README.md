# Brace

## Installation initiale des sources

### Prérequis

* Installation de NodeJS
* Récupération du fichier zip

### Procédure d'installation

* Déziper le fichier zip
* Se placer dans le dossier du projet avec un interpréteur de commandes
* Exécuter la commande suivante : <code>npm install</code>
Cette commande va installer les dépendances et les librairies requises pour le projet.

## Démarrage du serveur local

Pour lancer le serveur en local, il faut se placer dans le dossier du projet avec un interpréteur de commandes et exécuter la commande suivante :
<code>npm start</code>

L'application Web est ensuite disponible à l'adresse <code>http://localhost:3000</code> via le navigateur CHROME (et uniquement ce navigateur)

## Utilisation de l'application

Entrer son pseudonyme dans la première case ("Enter your nickname")
Choisissez la personnalisation du ballon grâce à la liste déroulante
Cliquez sur le bouton **Log in**

Pour la suite, deux cas de figure 
* Vous êtes le premier joueur : Lorsque tout les joueurs sont prêts, un bouton **Start** apparait et sert à démarrer le jeu avec les joueurs connectés. Une étape d'initialisation des connexions entre les joueurs démarre, puis le jeu se lance pour chacun des joueurs
* Vous n'êtes pas le premier joueur : Après votre inscription au jeu, il vous faudra attendre que la partie soit lancée par le premier joueur

## Explication du jeu B-Race

### Contexte et but du jeu

Vous contrôlez un ballon dans le ciel. Le but du jeu est d'atteindre le centre du terrain avant les autres joueurs. Des obtacles seront sur votre chemin afin de vous empêcher d'atteindre votre but. Des malus seront aussi présent pour vous piéger.

### Description de l'interface

Divers éléments sont présents sur l'interface du jeu :
* Le ballon : Au centre de l'écran, il représente le joueur.
* Le classement : Il vous donne une information approximative (en pourcentage) de votre position par rapport aux autres joueurs.
* Le cap : C'est une flèche qui vous indique la direction à suivre pour atteindre le centre du terrain.

### Commandes

* Sur PC -> Les touches directionnelles vous permettent de déplacer le ballon :
	* Gauche - Droite : Direction du ballon.
	* Haut - Bas : Vitesse du ballon.
* Sur Smartphone -> L'écran tactile vous permet de déplacer le ballon :
	* Centre-Gauche - Centre-Droit de l'écran : Direction du ballon.
	* Haut - Bas de l'écran : Vitesse du ballon.

### Description des éléments du jeu

En dehors de votre ballon, divers éléments sont présents dans le ciel :
* Obstacles -> Ce sont des sphères rouges à piques : Ces sphères sont infranchissables et vous ralentissent dans votre progression.
* Malus inversion des touches -> Représentés par des flèches noires : Lorsque votre ballon traverse ce malus, les touches directionnelles sont inversées.
* Malus de vitesse -> Représentés par une roue dentée : Lorsque votre ballon traverse ce malus, votre vitesse est grandement réduite.