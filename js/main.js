let keys;
let editing = false;
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

	$('#loginBtn').click(()=> {
		$('#dialog4').show();
	});

	$('#dialogBackground1').click(()=> {
		$('#dialog1').hide();
	});

	$('#dialogBackground2').click(()=> {
		$('#dialog2').hide();
	});

	$('#dialogBackground3').click(()=> {
		$('#dialog3').hide();
		$('#pendingProduct').text(null);
		$('#deleteDelete').attr('data-id', null);
	});

	$('#dialogBackground4').click(()=> {
		$('#dialog4').hide();
	});

	$('#deleteCencel').click(()=> {
		$('#dialog3').hide();
		$('#pendingProduct').text(null);
		$('#deleteDelete').attr('data-id', null);
	});

	$('#deleteDelete').click((e)=> {
		let pendingId = e.target.dataset.id;

		$.ajax({
			url: `${keys.SERVER_URL}:${keys.SERVER_PORT}/product/delete/id=${pendingId}`,
			type: 'DELETE',
			dataType: 'json',
			error: (err)=> {
				console.log('There was an error');
				console.log(err);
			},
			success: (result)=> {
				$(`[data-id='${pendingId}']`).parent().parent()[1].remove();
				$('#dialog3').hide();
				$('#pendingProduct').text(null);
				$('#deleteDelete').attr('data-id', null);
			}
		});
	});

	$('#submitBtn').click(()=> {
		event.preventDefault();
		let productName = $('#productName').val();
		let productPrice = $('#productPrice').val();

		if (editing) {
			let id = $('#productHiddenId').val();
			$.ajax({
				url: `${keys.SERVER_URL}:${keys.SERVER_PORT}/product/update/id=${id}`,
				type: 'PATCH',
				data: {
					name: productName,
					price: productPrice
				},
				error: (err)=> {
					console.log('There was an error');
					console.log(err);
				},
				success: (result)=> {
					console.log(result);
					$('#productName').val(null);
					$('#productPrice').val(null);
					$('#submitBtn').text('Add Product').removeClass('edit');
					$('#productHiddenId').val(null);
					loadAll();
					editing = false;
				}
			});
		} else {
			console.log('yeet');
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
					console.log(result);
					loadAll();
				}
			});
		}
	});

	$('#submitBtn2').click(()=> {
		event.preventDefault();
		let username = $('#rUsername').val();
		let password = $('#rPassword').val();
		let age = $('#rAge').val();
		let favColor = $('#rFavColor').val();

		if (username.trim() && password.trim() && age.trim() && favColor.trim()) {
			$.ajax({
				url: `${keys.SERVER_URL}:${keys.SERVER_PORT}/user/add`,
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
					$('#dialog4').hide();
					$('#rUsername').val(null);
					$('#rPassword').val(null);
					$('#rAge').val(null);
					$('#rFavColor').val(null);
				}
			})
		}
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

	$('#submitBtn4').click(()=> {
		event.preventDefault();
		let username = $('#lUsername').val();
		let password = $('#lPassword').val();
		if (username.trim() && password.trim()) {
			$.ajax({
				url: `${keys.SERVER_URL}:${keys.SERVER_PORT}/user/get`,
				type: 'POST',
				data: {
					username: username,
					password: password
				},
				error: (err)=> {
					console.log('There is an error');
					console.log(err);
				},
				success:(result)=> {
					if (result == 'invalid user') {
						console.log('wrong username');
					} else if (result == 'invalid password') {
						console.log('wrong password');
					} else {
						console.log('YEEET! yoou are logged in!');
						console.log(result);
						sessionStorage.setItem('userId', result._id);
						sessionStorage.setItem('userName', result.username);
						sessionStorage.setItem('userAge', result.age);
					}
				}
			});
		}
	});

	function loadAll () {
		$.ajax({
			url: `${keys.SERVER_URL}:${keys.SERVER_PORT}/all_db`,
			type: 'GET',
			dataType: 'json',
			error: (err)=> {
				console.log('There was an error');
				console.log(err);
			},
			success: (data)=> {
				$('#list').html(null);
				for (var i = 0; i < data.length; i++) {
					$('#list').append(`<li><div class="productItem"><span class="itemName">${data[i].name}</span><div class="itemButtons" data-id="${data[i]._id}"><button class="editBtn">Edit</button><button class="deleteBtn">Delete</button></div></div></li>`);
				}
				[].forEach.call(document.querySelectorAll('.editBtn'), (e)=> {
					e.addEventListener('click', ()=> {
						let id = e.parentNode.dataset.id;
						$.ajax({
							url: `${keys.SERVER_URL}:${keys.SERVER_PORT}/db_id/id=${id}`,
							type: 'GET',
							dataType: 'json',
							error: (err)=> {
								console.log('There was an error');
								console.log(err);
							},
							success: (result)=> {
								console.log(result);
								$('#productName').val(result.name);
								$('#productPrice').val(result.price);
								$('#submitBtn').text('Edit Product').addClass('edit');
								$('#productHiddenId').val(result._id);
								editing = true;
							}
						});
					});
				});

				[].forEach.call(document.querySelectorAll('.deleteBtn'), (e)=>{
					e.addEventListener('click', ()=> {
						$('#pendingProduct').text(e.parentNode.parentNode.children[0].innerText);
						$('#deleteDelete').attr('data-id', e.parentNode.dataset.id);
						$('#dialog3').show();
					});
				});
			}
		});
	}

	loadAll();
}
console.log(sessionStorage);
