db.donnee._findFetch({ device: "FLECHES" },{}, function (res) {
	isSize = true
		data = []
	    res.forEach(function (value) {
			value.dataResults.forEach(function (results) {
	    		if (!isSize && results.taille == SIZECELLS.NORMAL) { data.push(results) }
	    		if (isSize && results.distance == DISTANCEFIXEE && results.taille) { data.push(results) };
	    	})
		})
		data = data.sort(function (a,b) { 
			if (!isSize) { return a.distance-b.distance }
			if (isSize) { return a.taille-b.taille }
		})
		console.log("Données "+device+" :"+ data.length)
		// callback(data)
	})