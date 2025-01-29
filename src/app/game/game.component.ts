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
export class GameComponent {
pickCardAnimation = false;
game: Game;
currentCard: String = '';
unssubSingleGame: any;
gameId: any;


  constructor (public dialog: MatDialog,  private firestore: Firestore, private route: ActivatedRoute) { 
    this.game =  new Game();
    console.log('constru',this.game);
    
  }

  ngOnInit(): void {
    this.newGame();
    // ngOnInit wird von Angular automatisch ausgeführt, 
  // nachdem die Komponente vollständig initialisiert wurde.
  // Dies ist ein guter Ort für Initialisierungen, die von Eingabewerten (@Input) oder anderen Abhängigkeiten abhängen.
   // Das `void` zeigt an, dass diese Methode nichts zurückgibt.
    this.route.params.subscribe((params) => {
      console.log(params['id']);
      this.gameId = params['id'];
      onSnapshot(this.getdocument(), (game: any) => {  // Hier war der Fehler - falsche Klammerplatzierung
        console.log('gagaag',game.data());  // Direkt die Daten des Spiels loggen
        this.game.currentPlayer = game.currentPlayer;
        this.game.playedCard = game.playedCards;
        this.game.players = game.players;  // "player" in deinem ursprünglichen Beispiel zu "players"
        this.game.stack = game.stack;
      });
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
    console.log('negame', this.game);
    
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent)

      
    
    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
      this.game.players.push(name)
      this.updateGame();
    }
    });

}

async updateGame() {
  await updateDoc(this.getdocument(), this.game.toJson())

}

getdocument() {
   return doc(this.firestore, 'games', this.gameId)
}

}


