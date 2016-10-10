#include <stdio.h>
#include <stdarg.h>
#include <string.h>

#define RED   "\x1B[31m"
#define GRN   "\x1B[32m"
#define YEL   "\x1B[33m"
#define BLU   "\x1B[34m"
#define MAG   "\x1B[35m"
#define CYN   "\x1B[36m"
#define WHT   "\x1B[37m"
#define RESET "\x1B[0m"

int main(int argc, char *argv[]){
	char *farger[7] = {RED, GRN, YEL, BLU, MAG, CYN, WHT};
	char *skrift = "Dette er en fargerik tekst";
	for(int i=0; i<=strlen(skrift); i++){
		printf(farger[i%7]);
		char peker[2]; 
		peker[0] = skrift[i];
		peker[1] = 0;
 		printf(peker);
	}
	
	printf("\n");
}
