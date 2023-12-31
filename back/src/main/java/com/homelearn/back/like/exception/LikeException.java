package com.homelearn.back.like.exception;

import lombok.Getter;

@Getter
public class LikeException extends RuntimeException{
    private final LikeErrorCode errorCode;

    public LikeException(LikeErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}

