
module.exports = {
	data: {
		'2':  5,
		'3':  16,
		'4':  28,
		'5':  44,
		'6':  63,
		'7':  90,
		'8':  127,
		'9':  183,
		'10': 276,
		'11': 462,
		'12': 1020,
	},
	getT: function(card, buoc){
		var up   = ((this.data[card])/100)*(6/(5+buoc));
		var down = ((this.data[14-card])/100)*(6/(5+buoc));
		return {up:up, down:down};
	},
}
