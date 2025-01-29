import { Component } from '@angular/core';
import { Game } from '../models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { inject } from '@angular/core';
import { Firestore, collectionData, collection, doc, getDoc, onSnapshot, updateDoc  } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';




@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent  {
pickCardAnimation = false;
game: Game = new Game;
currentCard: String = '';
unssubSingleGame: any;
gameId: any;
firestore: Firestore = inject(Firestore);


  constructor (public dialog: MatDialog, private route: ActivatedRoute) { 
  }

  ngOnInit(): void {
    // ngOnInit wird von Angular automatisch ausgeführt, 
  // nachdem die Komponente vollständig initialisiert wurde.
  // Dies ist ein guter Ort für Initialisierungen, die von Eingabewerten (@Input) oder anderen Abhängigkeiten abhängen.
   // Das `void` zeigt an, dass diese Methode nichts zurückgibt.
    this.route.params.subscribe((params) => {
      console.log(params['id']);
      this.gameId = params['id'];
      onSnapshot(this.getdocument(), (game: any) => { 
        if (game.exists()) {// Hier war der Fehler - falsche Klammerplatzierung
        console.log('gagaag',game.data());  
        const gameData = game.data();
        this.game.currentPlayer = gameData.currentPlayer || 0;
        this.game.playedCard = gameData.playedCard || [];
        this.game.players = gameData.players || [];  // "player" in deinem ursprünglichen Beispiel zu "players"
        this.game.stack = gameData.stack || [];
     } });
    });
  
  }

  pickCard() {
    if (!this.pickCardAnimation ) {
      
    
    this.pickCardAnimation = true
    let popCard  = this.game.stack.pop();

    if (popCard !== undefined) {
      this.currentCard = popCard;
    }
    this.updateGame();
    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length
    setTimeout(() => {
      this.game.playedCard.push(this.currentCard);
      this.pickCardAnimation = false;
      this.updateGame();
    }, 1000);
    
    }  
  }
  
  getFire() {
    return collection(this.firestore, 'games');
  }

  newGame() {
  this.game =  new Game();
    console.log('negame',this.game);
    
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, { restoreFocus: false });

      
    
    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
      this.game.players.push(name);
      console.log('Aktuelle Spieler:', this.game.players);
      this.updateGame();
    }

    });

}

async updateGame() {
  try {
    await updateDoc(this.getdocument(), this.game.toJson());
    console.log("Game erfolgreich aktualisiert:", this.game);
  } catch (error) {
    console.error("Fehler beim Speichern in Firestore:", error);
  }
}

getdocument() {
   return doc(this.firestore, 'games', this.gameId)
}

}


