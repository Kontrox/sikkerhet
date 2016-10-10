CC=gcc
CFLAGS=-O2 -march=native 
DEPS=fargeskrift.h 
DEPS2=fargeskrift.o

.PHONY: all clean install

.SUFFIXES:

.PRECIOUS: %.o


all: fargedemo fargetest farger

%.o: %.c $(DEPS)
	$(CC) -c $(CFLAGS) $< -o $@

%: %.o $(DEPS) $(DEPS2)
	$(CC) -o $@ $< $(DEPS2) 



clean:
	rm -f *.o fargedemo fargetest farger

install: fargedemo fargetest farger
	cp fargedemo fargetest farger /usr/local/bin/


