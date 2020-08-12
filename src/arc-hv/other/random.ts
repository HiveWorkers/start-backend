export class Random {
  private alphabetical: Array<string> = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  private numeric: Array<string> = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  private alphanumeric: Array<string> = this.alphabetical.concat(this.numeric);

  constructor()
  {
  }

  Random(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  private TypeCaractere(type: 'alphabetical' | 'numeric' | 'alphanumeric' = 'alphabetical') : Array<string> {
    let result: Array<string> = [];
    if (type == 'alphabetical') {
      result = this.alphabetical;
    } else if (type == 'numeric') {
      result = this.numeric;
    } else if (type == 'alphanumeric') {
      result = this.alphanumeric;
    } else {
      result = [];
    }
    return result;
  }
  Value(type: 'alphabetical' | 'numeric' | 'alphanumeric' = 'alphabetical', nbreCaractere = 5): string {
    let resultat: string = '';
    const tabSelection: Array<string> = this.TypeCaractere(type);
    const max: number = tabSelection.length - 1;
    for (let i = 0; i < nbreCaractere; i++) {
      resultat = resultat + tabSelection[this.Random(0, max)];
    }
    return resultat;
  }
  Alphabetical(nbreCaractere = 5): string {
    return this.Value('alphabetical', nbreCaractere);
  }
  Numeric(nbreCaractere = 5): string {
    return this.Value('numeric', nbreCaractere);
  }
  Alphanumeric(nbreCaractere = 5): string {
    return this.Value('alphanumeric', nbreCaractere);
  }
}