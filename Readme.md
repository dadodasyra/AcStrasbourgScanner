# Scanneur de numéro de candidat pour l'académie de strasbourg

Ce code est une archive d'un mini projet qui est uniquement destiné à être utilisé dans un cadre éducationnel et qui ne doit pas être utilisé pour trouver des informations personnelles sur quelqu'un.

### Comment ça marche ?
Il est possible de récupérer le numéro de candidat (et donc ses résultats d'une épreuve tel que le DNB, Brevet des Collèges).
L'outil ouvre [cette page](https://c-resultats.ac-strasbourg.fr/publication_A15/login) et inscrit automatiquement un numéro de candidat et la date d'anniversaire indiqué.
Il est plus rapide d'indiquer le préfixe de l'établissement (thread.js ligne 47) ainsi que la date d'anniversaire (thread.js ligne 48).
Si vous voulez indiquer un prefix moins précis (7 caractères par exemple), il vous faut changer le 3 de la ligne 20 qui correspond à la taille du suffixe.

N'hésitez pas à jouer avec les sleep si vous avez des erreurs car vous avez une connexion 💩.
