import { Component } from '@angular/core';
import { Game } from '../models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { inject } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
pickCardAnimation = false;
game: Game;
currentCard: String = '';

  constructor (public dialog: MatDialog,  private firestore: Firestore) { 
    this.game = new Game()
  }

  ngOnInit(): void {
    // ngOnInit wird von Angular automatisch ausgeführt, 
  // nachdem die Komponente vollständig initialisiert wurde.
  // Dies ist ein guter Ort für Initialisierungen, die von Eingabewerten (@Input) oder anderen Abhängigkeiten abhängen.
   // Das `void` zeigt an, dass diese Methode nichts zurückgibt.
    this.newGame();
    this.firestore.collection('games').valueChanges().subscribe((game: any) => {
      console.log('game Update', game);
      
    });
  }

  pickCard() {
    if (!this.pickCardAnimation ) {
      
    
    this.pickCardAnimation = true
    let popCard  = this.game.stack.pop();

    if (popCard !== undefined) {
      this.currentCard = popCard;
    }

    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length
    setTimeout(() => {
      this.game.playedCard.push(this.currentCard);
      this.pickCardAnimation = false;
    }, 1000);
    
    }  
  }

  newGame() {
    this.game =  new Game();
    console.log(this.game);
    
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent)

      
    
    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
      this.game.players.push(name)
    }
    });

}


}


