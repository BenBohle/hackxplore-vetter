CC = cc
CFLAGS = -g -Wall -Wextra -Werror -I/opt/homebrew/include/cjson
LDFLAGS = -L/opt/homebrew/lib
LIBS = -lcurl -lcjson

SRC = main.c c_components/jsonConverter.c
EXE = monitoring

all: $(EXE)

$(EXE): $(SRC)
	$(CC) $(CFLAGS) $(SRC) $(LDFLAGS) $(LIBS) -o $(EXE)

clean:
	rm -f *.o

fclean: clean
	rm -f $(EXE)

re: fclean all

.PHONY: all clean fclean re
