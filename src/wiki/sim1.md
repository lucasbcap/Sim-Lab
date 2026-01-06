# Simulation fluide (particules)

## Idee generale
La simulation represente un fluide a partir d'un grand nombre de petites
particules (des billes). Chaque particule obeit a la gravite, rebondit sur les
parois et entre en collision avec les autres particules et les obstacles.

## Forces et integration
- Gravite appliquee sur l'axe Y.
- Frottement lineaire pour dissiper l'energie.
- Integration explicite (Euler) avec sous-pas pour stabiliser le mouvement.

## Collisions
### Bille - parois
La boite est tournee d'un angle. Les positions/velocites sont converties dans
le repere local de la boite, puis on fait un rebond classique sur les bords.

### Bille - bille
On detecte le chevauchement, on applique une correction de position, puis une
impulsion elastique pour simuler le rebond.

### Bille - obstacle
Les obstacles sont des disques fixes dans le repere local de la boite. Chaque
collision repousse la bille et applique une impulsion.

## Parametres importants
- Gravite, rebond, frottement.
- Taille des particules, nombre de particules.
- Iterations du solveur et nombre de sous-pas.
- Rotation de la boite (manuelle ou auto).

## Ameliorations possibles
- Mise en place d'une vraie viscosite (SPH ou PBD).
- Uniform grid pour accelerer les collisions.
- Coloration par vitesse ou densite.
