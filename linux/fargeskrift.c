#include "fargeskrift.h"
#include <stdio.h>
#include <stdarg.h>

//Funksjon som skriver ut (som printf) men med de angitte fargene.
//Denne funksjonen brukes av flere andre programmer.
int farge_printf(int tekstfarge, int bakgrunnsfarge, char *fmt, ...) {
	va_list ap;
	int rc;
	//Still inn farge med ANSI fargekoder:
	printf("\e[%i;%im",tekstfarge+30,bakgrunnsfarge+40);
	//Skriv ut resten med printf:
	va_start(ap, fmt);
	rc = vprintf(fmt, ap);
	va_end(ap);
	return rc;
}
