var automaton = 
{
  _ruleNumber: 0,
  _generationCount: 0,
  _ruleSet : [],
  _cell: [],
  _cellNumber: 10,//anzahl der Zellen

  //getter/ Setter
  
  get ruleset()
  {
    return this._ruleset;
  },
  
  //Funktionen
  
  calculateCellNumber: function()
  {
    },
  clearAll: function()
  {
    
  },
  
  initialise: function()
  {
    for (i = 0; i<this._cellNumber; i++)
    {
      this._cell.push(new Cell());
      //neue Zelle wird hinten an das Array angefügt
      this._cell[i].position = i;
      if (i> 1)
      {
        this._cell[i-1].setNeighbours();   
      }  
    }
    this._cell[0].setNeighbours();
    this._cell[this._cell.length].setNeighbours();
    clearAll();
  },
  
  initialiseStart: function()
  {},
  
  convertRule: function(rulenumber)
  {},
  
  run: function()
  {},
};
