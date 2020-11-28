function TestFunction ()
{
    let value = 50;
    let value02 = 100;
}


var sketch01 = function (p)
{
    p.setup = function()
    {
        var testObject = new TestFunction();
        console.log(testObject);
        p.createCanvas(500,500);
        console.log (testObject.value02);
    };
    p.draw = function()
    {
        p.background(0);
        p.fill(255);
        p.rect (testObject.value,testObject.value02,50,50);
        console.log(testObject.value);
    }
}
var myp5 = new p5(sketch01);