#include <stdio.h>
#include "fargeskrift.h"

const int max = 7;

//Demonstrerer ANSI-farger
void fargedemo() {
	farge_printf(7,0,"bakgr\nfarge  forgrunnsfarge\n       ");
	for (int x = 0; x <= max; ++x) {
		printf("%4i  ", x);
	}

	for (int y = 0; y <= max; ++y) {
		farge_printf(7,0,"\n%5i  ", y);
		for (int x = 0; x <= max; ++x) {
			farge_printf(x, y, "f:%2i  ",x);
		}
	}
	farge_printf(9, 0, "\n");
}

int main(int argc, char *argv[]) {
	fargedemo();
}

