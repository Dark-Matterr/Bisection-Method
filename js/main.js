$(document).ready(function(){
	$("#calculate").click(function(){
		$("#solution").fadeOut();
		//Calculator init
		$("#graphs").text('');
		var elt = document.getElementById('graphs');
		var calculator = Desmos.GraphingCalculator(elt, {keypad: false, expressions:false});
		//play math function
		var in_x0 = $("#interval_x0").val();
		var in_x1 = $("#interval_x1").val();
		var in_error = $("#error").val()
		if((func(in_x0)*func(in_x1)) < 0){
			try{
				$("#solution-approx").text("$C_n = "+bisection(parseFloat(in_x0), midpoint(parseFloat(in_x0), parseFloat(in_x1)), parseFloat(in_x1), parseFloat(in_error))+"$");
				$("#solution-fapprox").text("$f(C_n) = "+func(bisection(parseFloat(in_x0), midpoint(parseFloat(in_x0), parseFloat(in_x1)), parseFloat(in_x1), parseFloat(in_error)))+"$");
				calculator.setExpression({ id: 'graph1', latex: 'y='+nerdamer.convertToLaTeX($("#function").val())});
				$("#solution").fadeIn();
			}
			catch(err){
				mathError();
			}
			MathJax.Hub.Queue(["Typeset", MathJax.Hub, "solution"]);
		}else{
			BisectionError();
		}
	});

	function round(value, decimals) {
  		return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
	}

	function func(x){
		return nerdamer($("#function").val(), {x:x}, ['expand', 'numer'])
	}
	
	function midpoint(a, b){
		return (a+b)/2;
	}

	function iter_error(a, b, n){
		return Math.abs(b-a)/Math.pow(2, n)
	}

	function bisection(a, mid, b, err, prev_val, iter=1, tbl=""){
		tbl += "<tr><th scope=\"row\">"+iter+"</th><td>"+a+"</td><td>"+b+"</td><td>"+round(func(a), 5)+"</td><td>"+round(func(b), 5)+"</td><td>"+round(midpoint(a,b), 5)+"</td><td>"+round(func(midpoint(a, b)), 5)+"</td><td>"+round(iter_error(a, b, iter), 5)+"</td></tr>";
		if(err >= Math.abs(prev_val - mid)){
			$("#iter_tbl").html(tbl);
			$("#solution-itertext").html("The root was approximated using "+iter+" iterations ($n="+iter+"$)")
			return mid;
		}
		else if(Math.sign(func(mid)) != Math.sign(func(a))){
			return bisection(a, midpoint(a, mid), mid, err, mid, iter+1, tbl);
		}
		else{
			return bisection(mid, midpoint(mid, b), b, err, b, iter+1, tbl);
		}
	}

	function mathError(){
		Swal.fire({
			title: 'Math Error!',
			text: "Please recheck your inputs",
			icon: 'warning',
			showCancelButton: false,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Okay, Master!'
		});
	}

	function BisectionError(){
		Swal.fire({
			title: 'Bisection can\'t be used',
			text: "Try another function or interval",
			icon: 'warning',
			showCancelButton: false,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Okay, Master!'
		});
	}

});