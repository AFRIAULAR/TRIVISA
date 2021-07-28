// inicializamos un array de arrays con la preguntas del juego. 
var questions = [
	[
		"How old are you?",
		"Ten years old",
		"Eleven years old",
		"One One years old",
		"Zero years old",
		1
	],
	[
		"¿Como se llamaba la hija de San Martin?",
		"Mercedes",
		"Remedios",
		"Juana Azurduy",
		"Josefa",
		0
	],
	[
		"Completa la cancion: 'Love of my life, don't leave me...'",
		"What it means to me",
		"Bring it back, bring it back",
		"Please, bring it back home to me",
		"You've taken my love, and now desert me",
		3
	],
	[
		"¿Cual es el resultado de: 1450 / 50?",
		"50",
		"38",
		"29",
		"Ninguno de los anteriores",
		2
	],
	[
		"Uno de éstos ingredientes NO forma parte de la receta de Beignets de Tiana, cuál es?",
		"Levadura",
		"Sal",
		"Miel",
		"Huevos",
		2
	],
	[
		"Qué significa pulguiento? Busca en el diccionario",
		"De mala calidad",
		"Del dedo pulgar",
		"Equivalente a una pulgada",
		"Isabella pulgosa",
		0
	],
	
	[
		"Cómo se llama el hijo de Sophie?",
		"Danny",
		"Donald",
		"Denny",
		"Donny",
		3
	],
	[
		"Nombre de las hermanas Mirabal",
		"Patria, Minerva, Lucrecia, Dedé",
		"Patria, Minerva, Teresa, Dedé",
		"Patria, Miranda, Teresa, Dedé",
		"Patria, Minerva, Libertad, Dedé",
		1
	],
	[
		"Si tomas la edad de tus padres, la multiplicas por la edad de tus primos y la divides entre la de tu abuela, cual es el resultado? No usar calculadora",
		"7.03",
		"7.30",
		"7.4",
		"Ay no tú",
		0
	],
	[
		"Si tengo un helado y se derrite, podríamos decir que pasó de estado ---- a ----",
		"Sólido a líquido",
		"Líquido a gaseoso",
		"Gaseoso a sólido",
		"Sólido a gaseoso",
		0
	],
	[
		"Dónde queremos estar?",
		"Disney",
		"Las Vegas",
		"Río",
		"Juntas en París",
		3
	],
];

// Aquí utilizamos UnderscoreJS para generar un template de pregunta.
var questionTemplate = _.template(" \
	<div class='card question'><span class='question'><%= question %></span> \
      <ul class='options'> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='0' id='q<%= index %>o1'> \
          <label for='q<%= index %>o1'><%= a %></label> \
        </li> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='1' id='q<%= index %>o2'> \
          <label for='q<%= index %>o2'><%= b %></label> \
        </li> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='2' id='q<%= index %>o3'> \
          <label for='q<%= index %>o3'><%= c %></label> \
        </li> \
        <li> \
          <input type='radio' name='question[<%= index %>]' value='3' id='q<%= index %>o4'> \
          <label for='q<%= index %>o4'><%= d %></label> \
        </li> \
      </ul> \
    </div> \
    ");

// Definimos las variables de estado del juego y los valores iniciales (como el tiempo de respuesta de cada pregunta).
var points,
	pointsPerQuestion,
	currentQuestion,
	questionTimer,
	timeForQuestion = 60, // segundos
	timeLeftForQuestion; 
// Manipulacion de elementos con JQuery.
$(function() {

	// Uso de jQuery para escuchar el evento click del botón de Comenzar y Volver a jugar.
	$('button.start').click(start);
	$('.play_again button').click(restart);

	// La función restart inicializa los valores de las variables de estado del juego.
	function restart() {
		points = 0;
		pointsPerQuestion = 10;
		currentQuestion = 0;
		timeLeftForQuestion = timeForQuestion;
	// Se oculta la pantalla de finalizar y un mensaje que dice "Se acabó el tiempo".
		$('.finish.card').hide();
		$('div.start').show();
		$('.times_up').hide();

		generateCards();
		updateTime();
		updatePoints();
	}

	//  La función start se ejecuta cuando el jugador hace click en comenzar.
	function start() {
		$('div.start').fadeOut(200, function() {
			moveToNextQuestion();
		});
	}

	// Esta es una de las funciones clave del juego, encargada de generar las preguntas. 
	function generateCards() {
		$('.questions').html('');
		for (var i = 0; i < questions.length; i++) {
			var q = questions[i];
			var html = questionTemplate({
				question: q[0],
				index: i,
				a: q[1],
				b: q[2],
				c: q[3],
				d: q[4]
			});
			$('.questions').append(html);
		};

                // Indicamos que nos interesa el evento change de los inputs dentro de los elementos con clase question y card (cada una de las preguntas).
		$('.question.card input').change(optionSelected);
	}

	// Esta función cambia el estado del juego para pasar de una pregunta a la siguiente.
	function moveToNextQuestion() {
		currentQuestion += 1;
		if (currentQuestion > 1) {
			$('.question.card:nth-child(' + (currentQuestion-1) + ')').hide();
		}

		// Se muestra la siguiente pregunta.
		showQuestionCardAtIndex(currentQuestion);
		setupQuestionTimer();
	}

	// Esta función inicializa el temporizador para responder una pregunta.
	function setupQuestionTimer() {
		if (currentQuestion > 1) {
			clearTimeout(questionTimer);
		}
		timeLeftForQuestion = timeForQuestion;

		// Cada 1 segundo, nuestro temporizador llamará a la función countdownTick(). 
		questionTimer = setTimeout(countdownTick, 1000);
	}

	// Mostramos la tarjeta de pregunta correspondiente al índice que la función recibe por parámetro.
	function showQuestionCardAtIndex(index) { // staring at 1
		var $card = $('.question.card:nth-child(' + index + ')').show();
	}

	// La función countdownTick() se ejecuta cada un segundo, y actualiza el tiempo restante para responder en la pantalla del jugador.
	function countdownTick() {
		timeLeftForQuestion -= 1;
		updateTime();
		if (timeLeftForQuestion == 0) { 
			return finish();
		}
		questionTimer = setTimeout(countdownTick, 1000);
	}

	// Actualiza el tiempo restante en pantalla, utilizando la función html(). 
	function updateTime() {
		$('.countdown .time_left').html(timeLeftForQuestion + 's');
	}

	// Actualiza los puntos en pantalla.
	function updatePoints() {
		$('.points span.points').html(points + ' puntos');
	}

	// Esta función se ejecuta cuando el jugador escoge una respuesta.
	function optionSelected() {
		var selected = parseInt(this.value);
		var correct = questions[currentQuestion-1][5];

		if (selected == correct) {
			points += pointsPerQuestion;
			updatePoints();
			correctAnimation();
		} else {
			wrongAnimation();
		}

		if (currentQuestion == questions.length) {
			clearTimeout(questionTimer);
			return finish();
		}
		moveToNextQuestion();
	}

	// Animación de respuesta correcta e incorrecta.
	function correctAnimation() {
		animatePoints('right');
	}

	// Animación de respuesta correcta e incorrecta.
	function wrongAnimation() {
		animatePoints('wrong');
	}

	// Esta función anima el puntaje en pantalla.
	function animatePoints(cls) {
		$('header .points').addClass('animate ' + cls);
		setTimeout(function() {
			$('header .points').removeClass('animate ' + cls);
		}, 500);
	}

	// Cuando el juego termina, esta función es ejecutada.
	function finish() {
		if (timeLeftForQuestion == 0) {
			$('.times_up').show();
		}
		$('p.final_points').html(points + ' puntos');
		$('.question.card:visible').hide();
		$('.finish.card').show();
	}

	// 24
	restart();

});