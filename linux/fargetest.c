#include <stdlib.h>
#include <stdio.h>
#include "fargeskrift.h"

int main(int argc, char *argv[]) {
	unsigned int fargenr, bakgr;
	
	if (argc != 2 || (fargenr = atoi(argv[1])) > 7 ) {
		printf("Oppgi et fargenr. mellom 0 og 7\n");
		exit(1);
	}
	bakgr = fargenr ? 0 : 7;
	farge_printf(fargenr, bakgr, "Farge nr:%i\n", fargenr);
}

