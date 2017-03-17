# Brace

## Installation initiale des sources

### Pr�requis

* Installation de NodeJS
* R�cup�ration du fichier zip

### Proc�dure d'installation

* D�ziper le fichier zip
* Se placer dans le dossier du projet avec un interpr�teur de commandes
* Ex�cuter la commande suivante : <code>npm install</code>
Cette commande va installer les d�pendances et les librairies requises pour le projet.

## D�marrage du serveur local

Pour lancer le serveur en local, il faut se placer dans le dossier du projet avec un interpr�teur de commandes et ex�cuter la commande suivante :
<code>npm start</code>

L'application Web est ensuite disponible � l'adresse <code>http://localhost:3000</code> via le navigateur CHROME (et uniquement ce navigateur)

## Utilisation de l'application

Entrer son pseudonyme dans la premi�re case ("Enter your nickname")
Choisissez la personnalisation du ballon gr�ce � la liste d�roulante
Cliquez sur le bouton **Log in**

Pour la suite, deux cas de figure 
* Vous �tes le premier joueur : Lorsque tout les joueurs sont pr�ts, un bouton **Start** apparait et sert � d�marrer le jeu avec les joueurs connect�s. Une �tape d'initialisation des connexions entre les joueurs d�marre, puis le jeu se lance pour chacun des joueurs
* Vous n'�tes pas le premier joueur : Apr�s votre inscription au jeu, il vous faudra attendre que la partie soit lanc�e par le premier joueur

## Explication du jeu B-Race

### Contexte et but du jeu

Vous contr�lez un ballon dans le ciel. Le but du jeu est d'atteindre le centre du terrain avant les autres joueurs. Des obtacles seront sur votre chemin afin de vous emp�cher d'atteindre votre but. Des malus seront aussi pr�sent pour vous pi�ger.

### Description de l'interface

Divers �l�ments sont pr�sents sur l'interface du jeu :
* Le ballon : Au centre de l'�cran, il repr�sente le joueur.
* Le classement : Il vous donne une information approximative (en pourcentage) de votre position par rapport aux autres joueurs.
* Le cap : C'est une fl�che qui vous indique la direction � suivre pour atteindre le centre du terrain.

### Commandes

* Sur PC -> Les touches directionnelles vous permettent de d�placer le ballon :
	* Gauche - Droite : Direction du ballon.
	* Haut - Bas : Vitesse du ballon.
* Sur Smartphone -> L'�cran tactile vous permet de d�placer le ballon :
	* Centre-Gauche - Centre-Droit de l'�cran : Direction du ballon.
	* Haut - Bas de l'�cran : Vitesse du ballon.

### Description des �l�ments du jeu

En dehors de votre ballon, divers �l�ments sont pr�sents dans le ciel :
* Obstacles -> Ce sont des sph�res rouges � piques : Ces sph�res sont infranchissables et vous ralentissent dans votre progression.
* Malus inversion des touches -> Repr�sent�s par des fl�ches noires : Lorsque votre ballon traverse ce malus, les touches directionnelles sont invers�es.
* Malus de vitesse -> Repr�sent�s par une roue dent�e : Lorsque votre ballon traverse ce malus, votre vitesse est grandement r�duite.