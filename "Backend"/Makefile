CC = cc
CFLAGS = -g -Wall -Wextra -Werror 

MONITORING_SRC = main.c

MONITORINGL_EXE = monitoring

NAME = $(MONITORINGL_EXE)

all: $(NAME)

$(MONITORINGL_EXE): $(MONITORING_SRC)
	$(CC) $(CFLAGS) -o $(MONITORINGL_EXE) $(MONITORING_SRC)

clean:
	rm -f *.o

fclean:
	rm -f $(NAME)

re: fclean  all

.PHONY: all clean fclean re 
