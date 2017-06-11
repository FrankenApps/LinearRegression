var dataPoints = 1;
var language = 'en';
var constError = 0;

Array.prototype.max = function(){
    return Math.max.apply( Math, this );
};

Array.prototype.min = function(){
    return Math.min.apply( Math, this );
};

$(document).ready(function() {
  $('#results').slideUp('fast', function() {
  });

  $('#dataPoints').on('keypress', function(event) {
    dataPoints = parseInt($('#dataPoints').val())+1;
    if(event.keyCode === 13){
    for (var i = 2; i < parseInt($('#dataPoints').val())+1; i++) {
      var r = $(`<input type="text" class="data_handler" id="x${i}" style="display:inline" />
                 <input type="text" class="data_handler" id="y${i}" style="display: inline; float:right" />`);
      $("#data-input").append(r);
    }
        $('#x1').focus();
      }
  });

  $('.data_handler').on('keypress', function(event) {
    if(event.keyCode === 13){
      if(this.id.charAt(0) == 'x'){
        $('#y'+this.id.substr(1)).focus();
      } else{
        $('#x'+String(parseInt(this.id.substr(1))+1)).focus();
      }
    }
    });

  //languages
  $('#lang_de').on('click', function(event) {
    lang_de();
  });

  $('#lang_en').on('click', function(event) {
    lang_en();
  });

  $('#delete').on('click', function(event) {
    location.reload();
  });

  $('#calc').on('click', function(event) {
    $('#results').slideDown('slow', function() {
    });

    var sumXi = 0;
    var sumYi = 0;
    var sumXiYi = 0;
    var sumXi_squared = 0;
    var sumYi_squared = 0;

    for (var i = 1; i < dataPoints; i++) {
      sumXi += parseFloat($('#x'+String(i)).val());
    }
    console.log('x_i Summe: ' + sumXi);

    for (var i = 1; i < dataPoints; i++) {
      sumYi += parseFloat($('#y'+String(i)).val());
    }
    console.log('y_i Summe: ' + sumYi);

    for (var i = 1; i < dataPoints; i++) {
      sumXiYi += parseFloat($('#x'+String(i)).val())*parseFloat($('#y'+String(i)).val());
    }
    console.log('x_i*y_i Summe: ' + sumXiYi);

    for (var i = 1; i < dataPoints; i++) {
      sumXi_squared += Math.pow(parseFloat($('#x'+String(i)).val()),2);
    }
    console.log('x_i^2 Summe: ' + sumXi_squared);

    for (var i = 1; i < dataPoints; i++) {
      sumYi_squared += Math.pow(parseFloat($('#y'+String(i)).val()),2);
    }
    console.log('y_i^2 Summe: ' + sumYi_squared);

    var a = 0;
    var b = 0;
    var s_y_squared = 0;

    a = (dataPoints*sumXiYi-sumXi*sumYi)/(dataPoints*sumXi_squared-Math.pow(sumXi,2));
    b = (sumXi_squared*sumYi-sumXi*sumXiYi)/(dataPoints*sumXi_squared-Math.pow(sumXi,2));
    s_y_squared = 1/(dataPoints-2)*(sumYi_squared-a*sumXiYi-b*sumYi);

    $('#a').html(`a: \\(a = \\frac{n \\ \\sum x_i y_i - \\sum x_i \\ \\sum y_i}{n \\sum x_i^2 - \\left(\\sum x_i \\right)^2} =  \\frac{${dataPoints} \\cdot ${sumXiYi} - ${sumXi} \\cdot ${sumYi}}{${dataPoints} \\cdot ${sumXi_squared} - \\left(${sumXi} \\right)^2} = ${a}\\)`);
    $('#b').html(`b: \\(b = \\frac{n \\ \\sum x_i^2 \\sum y_i - \\sum x_i \\ \\sum x_i \\ y_i}{n \\sum x_i^2 - \\left(\\sum x_i \\right)^2} = \\frac{${dataPoints} \\cdot ${sumXi_squared} \\cdot ${sumYi} - ${sumXi} \\cdot ${sumXiYi}}{${dataPoints} \\cdot ${sumXi_squared} - \\left(${sumXi} \\right)^2} = ${b} \\)`);
    $('#s_y_squared').html(`Squared Error: \\(s_y^2 = \\frac{1}{n-2} \\left( \\sum y_i^2 - a \\cdot \\sum x_i \\ y_i - b \\cdot \\sum y_i \\right) = \\frac{1}{${dataPoints-2}} \\left( ${sumYi_squared} - ${a} \\cdot ${sumXiYi} - ${b} \\cdot ${sumYi} \\right) =  ${s_y_squared}\\)`);
    $('#s_y').html(`Normal Error: \\(s_y = \\sqrt{s_y^2} = ${Math.sqrt(s_y_squared)} \\)`);

  //reload MathJax = force new Typesetting
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

  //Plot the data
  var xArray = [];
  for (var i = 1; i < dataPoints; i++) {
    xArray.push(parseFloat($('#x'+String(i)).val()));
  }
  var yArray = [];
  for (var i = 1; i < dataPoints; i++) {
    yArray.push(parseFloat($('#y'+String(i)).val()));
  }
  var errArray = Array(xArray.length).fill(constError);
  $('#plotWindow').css('display', 'inline-block');
  $('#plotTag').css('display', 'inline');

  var trace1 = {
    x: xArray,
    y: yArray,
    error_y: {
      type: 'data',
      array: errArray,
      visible: true
    },
    mode: 'markers',
    type: 'scatter',
    name: 'Data Points'
  };

  var trace2 = {
    x: [xArray.min(),xArray.max()],
    y: [a*xArray.min()+b,a*xArray.max()+b],
    mode: 'lines',
    type: 'scatter',
    name: 'Fitted Line'
  };

  var data = [trace1, trace2];

  Plotly.newPlot('plotWindow', data);



  });

});
