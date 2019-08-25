let keys;
$.ajax({
	url: 'config.json',
	type: 'GET',
	dataType: 'json',
	error: (err)=> {
		console.log('there was and error');
		console.log(err);
	},
	success: (data)=> {
		keys = data;
		runCode();
	}
});

function runCode () {
	$('#addUserBtn').click(()=> {
		$('#dialog1').show();
	});

	$('#sendMessageBtn').click(()=> {
		$('#dialog2').show();
	});

	$('#dialogBackground1').click(()=> {
		$('#dialog1').hide();
	});

	$('#dialogBackground2').click(()=> {
		$('#dialog2').hide();
	});


	$('#submitBtn').click(()=> {
		event.preventDefault();
		let productName = $('#productName').val();
		let productPrice = $('#productPrice').val();

		$.ajax({
			url: `${keys.SERVER_URL}:${keys.SERVER_PORT}/product/add/`,
			type: 'POST',
			data: {
				name: productName,
				price: productPrice
			},
			error: (err)=> {
				console.log('There was an error');
				console.log(err);
			},
			success: (result)=> {
				if (result == 'Product Added') {
					loadAll();
				} else {
					console.log(result);
				}
			}
		});
	});

	$('#submitBtn2').click(()=> {
		event.preventDefault();
		let username = $('#username').val();
		let password = $('#password').val();
		let age = $('#age').val();
		let favColor = $('#favColor').val();

		$.ajax({
			url: `${keys.SERVER_URL}:${keys.SERVER_PORT}/user/add/`,
			type: 'POST',
			data: {
				username: username,
				password: password,
				age: age,
				favColor: favColor
			},
			error: (err)=> {
				console.log('There was an error');
				console.log(err);
			},
			success: (result)=> {
				console.log(result);
				$('#list').append(`<li><div class="productItem"><span class="itemName">${result.name}</span><div class="itemButtons"><button class="editBtn">Edit</button><button class="deleteBtn">Delete</button></div></div></li>`)
			}
		});
	});

	$('#submitBtn3').click(()=> {
		event.preventDefault();
		let name = $('#name').val();
		let email = $('#email').val();
		let message = $('#message').val();

		$.ajax({
			url: `${keys.SERVER_URL}:${keys.SERVER_PORT}/contact`,
			type: 'POST',
			data: {
				name: name,
				email: email,
				message: message
			},
			error: (err)=> {
				console.log('There was an error');
				console.log(err);
			},
			success: (result)=> {
				console.log(result);
			}
		});
	});

	function loadAll () {
		$.ajax({
			url: `${keys.SERVER_URL}:${keys.SERVER_PORT}/all`,
			type: 'GET',
			dataType: 'json',
			error: (err)=> {
				console.log('There was an error');
				console.log(err);
			},
			success: (data)=> {
				$('#list').html(null);
				for (var i = 0; i < data.length; i++) {
					$('#list').append(`<li><div class="productItem"><span class="itemName">${data[i].name}</span><div class="itemButtons"><button class="editBtn">Edit</button><button class="deleteBtn">Delete</button></div></div></li>`);
				}
			}
		});
	}

	// loadAll();
}
